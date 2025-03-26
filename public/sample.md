在 Docker 中，**Bridge 网络模式**是默认的网络驱动，它通过创建一个虚拟的桥接网络（`docker0`），为容器提供隔离的网络环境，同时允许容器之间及容器与外部网络的通信。以下是详细解析：

---

### **1. Bridge 网络的核心机制**

- **虚拟网桥（`docker0`）**：  
  Docker 启动时会自动创建一个名为 `docker0` 的 Linux 网桥（可通过 `ifconfig` 或 `ip addr show docker0` 查看），所有连接到该桥接网络的容器会通过 `veth pair`（虚拟以太网设备对）挂载到网桥上。
- **NAT 与端口映射**：  
  容器通过 NAT（网络地址转换）与外部通信，需显式映射端口（`-p` 参数）才能从宿主机外部访问容器服务。

---

### **2. Bridge 网络的工作流程**

1. **IP 分配**：
   - 每个容器分配一个独立的私有 IP（通常为 `172.17.0.0/16` 子网）。
   - 宿主机作为网关（如 `172.17.0.1`）。
2. **容器间通信**：
   - 同一 Bridge 网络内的容器可直接通过 IP 或容器名通信（需 Docker DNS 支持）。
3. **外部访问**：
   - 容器访问外网：通过 `docker0` 网桥和宿主机的 NAT 规则（MASQUERADE）。
   - 外网访问容器：需通过 `-p` 映射端口（如 `-p 8080:80`）。

---

### **3. 关键特性**

| **特性**     | **说明**                                                       |
| ------------ | -------------------------------------------------------------- |
| **隔离性**   | 不同 Bridge 网络间的容器默认隔离，需通过网关或自定义网络连接。 |
| **性能**     | 轻量级，但存在 NAT 转发开销（低于 Host 模式，高于 Macvlan）。  |
| **适用场景** | 开发测试、单主机多容器通信、需端口映射的场景。                 |
| **DNS 解析** | 同一网络内的容器可通过名称自动解析（Docker 内置 DNS 服务）。   |

---

### **4. 操作示例**

#### **(1) 创建自定义 Bridge 网络**

```bash
docker network create --driver bridge my-bridge
```

#### **(2) 运行容器并连接到网络**

```bash
# 容器1（Web服务）
docker run -d --name web --network my-bridge -p 8080:80 nginx

# 容器2（数据库，同一网络）
docker run -d --name db --network my-bridge mysql
```

#### **(3) 验证通信**

```bash
# 在 web 容器内 ping db 容器（按名称解析）
docker exec web ping db
```

#### **(4) 查看网络详情**

```bash
docker network inspect my-bridge
```

---

### **5. Bridge 网络的底层实现**

- **`veth pair`**：  
  每个容器有一对虚拟网卡，一端在容器内（`eth0`），另一端挂载到 `docker0` 网桥。
- **iptables 规则**：  
  Docker 自动配置 NAT 规则（通过 `iptables -t nat -L` 查看）：
  ```bash
  # 外部访问容器的端口映射规则
  -A DOCKER ! -i docker0 -p tcp -m tcp --dport 8080 -j DNAT --to-destination 172.17.0.2:80
  ```

---

### **6. 与其他网络模式对比**

| **模式**    | **隔离性** | **性能** | **外部访问**       | **适用场景**         |
| ----------- | ---------- | -------- | ------------------ | -------------------- |
| **Bridge**  | 中等       | 中等     | 需端口映射         | 默认场景，多容器通信 |
| **Host**    | 无         | 最高     | 直接使用宿主机端口 | 高性能需求，放弃隔离 |
| **None**    | 完全隔离   | -        | 无网络             | 特殊安全需求         |
| **Macvlan** | 高         | 高       | 直接分配 MAC/IP    | 容器需表现为物理设备 |

---

### **7. 限制与注意事项**

- **跨主机通信**：原生 Bridge 网络不支持跨主机容器直连，需通过 Overlay 网络（Swarm/Kubernetes）或第三方工具（如 Calico）。
- **IP 冲突**：默认 Bridge 网络的子网可能与企业内网冲突，可通过 `--subnet` 自定义：
  ```bash
  docker network create --driver bridge --subnet 192.168.100.0/24 my-net
  ```
- **性能瓶颈**：大量容器时，NAT 和 iptables 规则可能成为瓶颈，可考虑 Macvlan 或 IPvlan。

---

### **总结**

Bridge 模式是 Docker 默认的网络方案，通过虚拟网桥和 NAT 机制平衡了隔离性与易用性。适合大多数单机容器化场景，但对于高性能或跨主机需求，需选择其他网络驱动（如 Macvlan/Overlay）。

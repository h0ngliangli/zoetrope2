export default defineNuxtRouteMiddleware((to, from) => {
  // to/from object example:
  /*
{
  "fullPath": "/edit/2",
  "hash": "",
  "query": {},
  "name": "edit-id",
  "path": "/edit/2",
  "params": {
    "id": "2"
  },
  "matched": [
    {
      "path": "/edit/:id?",
      "name": "edit-id",
      "meta": {},
      "props": {
        "default": false
      },
      "children": [],
      "instances": {},
      "leaveGuards": {},
      "updateGuards": {},
      "enterCallbacks": {},
      "components": {
        "default": {
          "__name": "[[id]]",
          "__hmrId": "da3264ee",
          "__file": "/home/lih/code/zoetrope2/app/pages/edit/[[id]].vue"
        }
      }
    }
  ],
  "href": "/edit/2"
}
    */
  // isAuthenticated() is an example method verifying if a user is authenticated
  //   if (isAuthenticated() === false) {
  //     return navigateTo("/login")
  //   }
  console.log("auth.global.js middleware", to, from)
})

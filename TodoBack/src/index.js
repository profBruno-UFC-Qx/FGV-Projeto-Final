'use strict';
const PUBLIC_ROLE = "PUBLIC"

async function grantRoutePermissions() {

  const roles = await strapi.service("plugin::users-permissions.role").find()

  async function grantPermission(systemRole, apiToGrant) {

      const roleId = roles.find(role => role.type === systemRole.toLocaleLowerCase()).id
      const role = await strapi.service("plugin::users-permissions.role").findOne(roleId)

      for (let permission in apiToGrant) {
          const controllers = role.permissions[permission].controllers
          for (let controller in apiToGrant[permission]) {
              for (let endPoint of apiToGrant[permission][controller]) {
                  controllers[controller][endPoint].enabled = true
              }
          }
      }
      await strapi.service("plugin::users-permissions.role").updateRole(role.id, role);
  }


  async function grantPermissionsToAll() {

    const apiToGrant = {
      'api::tarefa': {
          'tarefa': ["find", "findOne", "create", "update", "delete"]
      },
      'api::categoria': {
          'categoria': ['find']
      },
    }

    await grantPermission(PUBLIC_ROLE, apiToGrant)
  }

  await grantPermissionsToAll()
}

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap(/*{ strapi }*/) {
    grantRoutePermissions()
  },
};

import {Permission} from "./permission";
import {AppRole} from "@biit-solutions/authorization-services";

export class RoleBinding {

  private readonly KNOWLEDGE_SYSTEM_ADMIN: Permission[] = [
    Permission.KNOWLEDGE_SYSTEM.ROOT,
    Permission.KNOWLEDGE_SYSTEM.ADMIN
  ];

  private readonly KNOWLEDGE_SYSTEM_USER: Permission[] = [
    Permission.KNOWLEDGE_SYSTEM.ROOT,
    Permission.KNOWLEDGE_SYSTEM.USER
  ];

  private roles : AppRole[];

  constructor(roles: AppRole[]){
    this.roles = roles;
  }

  public getPermissions(): Set<Permission>{
    const roles: Permission[] = this.roles.map(role => {
        switch(role.toUpperCase()){
          case AppRole.KNOWLEDGESYSTEM_ADMIN:
            return this.KNOWLEDGE_SYSTEM_ADMIN;
          case AppRole.KNOWLEDGESYSTEM_USER:
            return this.KNOWLEDGE_SYSTEM_USER;
          default:
            return [];
        }
      }).flat();
    return new Set<Permission>(roles);
  }
}

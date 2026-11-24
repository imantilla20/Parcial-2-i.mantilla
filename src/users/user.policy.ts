import { Policy, type PolicyBefore } from '@nestjs/authorization';
import { User } from './entities/user.entity.js';

@Policy()
export class UserPolicy implements PolicyBefore<User> {
  // Corre antes de cada regla: el admin pasa siempre.
  before(user: User | null) {
    // user.roles es una LISTA (muchos a muchos): se busca 'admin' dentro de ella.
    if (user?.roles?.some((r) => r.role_name === 'admin')) return true; 
  }

  list(_user: User | null) { return false; }         
  assignRoles(_user: User | null) { return false; }   
}
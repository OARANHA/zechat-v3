import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  AllowNull,
  Index,
  Validate,
  Scopes
} from "sequelize-typescript";
import Tenant from "./Tenant";
import UserRole from "./UserRole";
import RolePermission from "./RolePermission";

/**
 * Tipos de status de role
 */
export type RoleStatus = 'active' | 'inactive' | 'archived';

/**
 * Role Model
 * Representa um papel/perfil no sistema RBAC
 * Permite atribuição de permissões específicas
 */
@Scopes(() => ({
  active: {
    where: { status: 'active' }
  },
  byTenant: (tenantId: number) => ({
    where: { tenantId }
  }),
  withPermissions: {
    include: [RolePermission]
  },
  withUsers: {
    include: [UserRole]
  }
}))
@Table({
  tableName: 'Roles',
  timestamps: true,
  underscored: true,
  paranoid: false,
  indexes: [
    { fields: ['tenantId'] },
    { fields: ['name', 'tenantId'], unique: true },
    { fields: ['status'] }
  ]
})
class Role extends Model<Role> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Tenant)
  @Column(DataType.INTEGER)
  tenantId!: number;

  @BelongsTo(() => Tenant)
  tenant!: Tenant;

  @Validate({ notEmpty: true })
  @Column(DataType.STRING(100))
  name!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string | null;

  @Validate({ isIn: [['active', 'inactive', 'archived']] })
  @Default('active')
  @Column(DataType.ENUM('active', 'inactive', 'archived'))
  status!: RoleStatus;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isDefault!: boolean;

  @AllowNull(true)
  @Column(DataType.JSON)
  metadata?: Record<string, any> | null;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Relacionamentos
  @HasMany(() => UserRole)
  userRoles!: UserRole[];

  @HasMany(() => RolePermission)
  rolePermissions!: RolePermission[];
}

export default Role;

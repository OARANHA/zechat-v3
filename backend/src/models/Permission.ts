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
import RolePermission from "./RolePermission";

/**
 * Tipos de escopo de permissão
 */
export type PermissionScope = 'tenant' | 'global' | 'system';
export type PermissionStatus = 'active' | 'inactive' | 'deprecated';

/**
 * Permission Model
 * Representa uma permissão específica no sistema RBAC
 * Cada permissão pode ser atribuída a múltiplas roles
 */
@Scopes(() => ({
  active: {
    where: { status: 'active' }
  },
  byTenant: (tenantId: number) => ({
    where: { tenantId }
  }),
  global: {
    where: { scope: 'global' }
  },
  tenantScoped: {
    where: { scope: 'tenant' }
  },
  withRoles: {
    include: [RolePermission]
  }
}))
@Table({
  tableName: 'Permissions',
  timestamps: true,
  underscored: true,
  paranoid: false,
  indexes: [
    { fields: ['tenantId'] },
    { fields: ['name', 'tenantId', 'scope'], unique: true },
    { fields: ['status'] },
    { fields: ['scope'] }
  ]
})
class Permission extends Model<Permission> {
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

  @Validate({ notEmpty: true })
  @Column(DataType.STRING(200))
  description!: string;

  @Validate({ isIn: [['tenant', 'global', 'system']] })
  @Default('tenant')
  @Column(DataType.ENUM('tenant', 'global', 'system'))
  scope!: PermissionScope;

  @Validate({ isIn: [['active', 'inactive', 'deprecated']] })
  @Default('active')
  @Column(DataType.ENUM('active', 'inactive', 'deprecated'))
  status!: PermissionStatus;

  @Validate({ notEmpty: true })
  @Column(DataType.STRING(100))
  resource!: string;

  @Validate({ notEmpty: true })
  @Column(DataType.STRING(100))
  action!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  conditions?: string | null;

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
  @HasMany(() => RolePermission)
  rolePermissions!: RolePermission[];
}

export default Permission;

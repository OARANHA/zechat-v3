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
  AllowNull,
  Index,
  Scopes
} from "sequelize-typescript";
import Role from "./Role";
import Permission from "./Permission";
import Tenant from "./Tenant";
import User from "./User";

/**
 * RolePermission Model
 * Tabela de junção entre Roles e Permissions
 * Representa atribuição de permissões a roles
 */
@Scopes(() => ({
  byRole: (roleId: number) => ({
    where: { roleId }
  }),
  byPermission: (permissionId: number) => ({
    where: { permissionId }
  }),
  byTenant: (tenantId: number) => ({
    where: { tenantId }
  }),
  withRole: {
    include: [Role]
  },
  withPermission: {
    include: [Permission]
  },
  withTenant: {
    include: [Tenant]
  },
  active: {
    where: {
      expiresAt: null
    }
  },
  expired: {
    where: {
      expiresAt: {
        $not: null,
        $lt: new Date()
      }
    }
  }
}))
@Table({
  tableName: 'RolePermissions',
  timestamps: true,
  underscored: true,
  paranoid: false,
  indexes: [
    { fields: ['roleId'] },
    { fields: ['permissionId'] },
    { fields: ['tenantId'] },
    { fields: ['roleId', 'tenantId'] },
    { fields: ['permissionId', 'tenantId'] },
    { fields: ['expiresAt'] }
  ]
})
class RolePermission extends Model<RolePermission> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;

  @ForeignKey(() => Permission)
  @Column(DataType.INTEGER)
  permissionId!: number;

  @BelongsTo(() => Permission)
  permission!: Permission;

  @ForeignKey(() => Tenant)
  @Column(DataType.INTEGER)
  tenantId!: number;

  @BelongsTo(() => Tenant)
  tenant!: Tenant;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  assignedBy?: number | null;

  @BelongsTo(() => User, 'assignedBy')
  assignedByUser?: User | null;

  @Default(() => new Date())
  @Column(DataType.DATE)
  grantedAt!: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  expiresAt?: Date | null;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  /**
   * Getter: Permissão está expirada?
   */
  get isExpired(): boolean {
    return this.expiresAt ? this.expiresAt < new Date() : false;
  }

  /**
   * Getter: Permissão está ativa (não expirada)?
   */
  get isActive(): boolean {
    return !this.isExpired;
  }
}

export default RolePermission;

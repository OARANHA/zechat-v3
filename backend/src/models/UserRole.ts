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
import User from "./User";
import Role from "./Role";
import Tenant from "./Tenant";

/**
 * UserRole Model
 * Tabela de junção entre Users e Roles
 * Representa atribuição de roles a usuários
 */
@Scopes(() => ({
  active: {
    where: { isDefault: true }
  },
  byUser: (userId: number) => ({
    where: { userId }
  }),
  byRole: (roleId: number) => ({
    where: { roleId }
  }),
  byTenant: (tenantId: number) => ({
    where: { tenantId }
  }),
  withUser: {
    include: [User]
  },
  withRole: {
    include: [Role]
  },
  withTenant: {
    include: [Tenant]
  }
}))
@Table({
  tableName: 'UserRoles',
  timestamps: true,
  underscored: true,
  paranoid: false,
  indexes: [
    { fields: ['userId'] },
    { fields: ['roleId'] },
    { fields: ['tenantId'] },
    { fields: ['userId', 'tenantId'] },
    { fields: ['expiresAt'] },
    { fields: ['isDefault'] }
  ]
})
class UserRole extends Model<UserRole> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;

  @ForeignKey(() => Tenant)
  @Column(DataType.INTEGER)
  tenantId!: number;

  @BelongsTo(() => Tenant)
  tenant!: Tenant;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  assignedBy?: number | null;

  @AllowNull(true)
  @Column(DataType.DATE)
  expiresAt?: Date | null;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isDefault!: boolean;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  /**
   * Getter: Atribuição está expirada?
   */
  get isExpired(): boolean {
    return this.expiresAt ? this.expiresAt < new Date() : false;
  }

  /**
   * Getter: Atribuição está ativa (não expirada)?
   */
  get isActive(): boolean {
    return !this.isExpired;
  }
}

export default UserRole;

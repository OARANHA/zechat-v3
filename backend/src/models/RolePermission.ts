import {
  Table,
  Column,
  Model,
  DataTypes,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Role from './Role';
import Permission from './Permission';
import Tenant from './Tenant';

@Table({
  tableName: 'RolePermissions',
  underscored: false,
  timestamps: false,
})
export default class RolePermission extends Model {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataTypes.INTEGER,
    field: 'roleId',
    allowNull: false,
  })
  roleId: number;

  @ForeignKey(() => Permission)
  @Column({
    type: DataTypes.INTEGER,
    field: 'permissionId',
    allowNull: false,
  })
  permissionId: number;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataTypes.INTEGER,
    field: 'tenantId',
    allowNull: false,
  })
  tenantId: number;

  @Column({
    type: DataTypes.INTEGER,
    field: 'assignedBy',
    allowNull: true,
  })
  assignedBy: number;

  @Column({
    type: DataTypes.DATE,
    field: 'grantedAt',
    defaultValue: DataTypes.NOW,
    allowNull: false,
  })
  grantedAt: Date;

  @Column({
    type: DataTypes.DATE,
    field: 'expiresAt',
    allowNull: true,
  })
  expiresAt: Date;

  @Column({
    type: DataTypes.DATE,
    field: 'createdAt',
    defaultValue: DataTypes.NOW,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataTypes.DATE,
    field: 'updatedAt',
    defaultValue: DataTypes.NOW,
    allowNull: false,
  })
  updatedAt: Date;

  // Associations
  @BelongsTo(() => Role, 'roleId')
  role: Role;

  @BelongsTo(() => Permission, 'permissionId')
  permission: Permission;

  @BelongsTo(() => Tenant, 'tenantId')
  tenant: Tenant;
}

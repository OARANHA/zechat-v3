import {
  Table,
  Column,
  Model,
  DataTypes,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import User from './User';
import Role from './Role';
import Tenant from './Tenant';

@Table({
  tableName: 'UserRoles',
  underscored: false,
  timestamps: false,
})
export default class UserRole extends Model {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.INTEGER,
    field: 'userId',
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataTypes.INTEGER,
    field: 'roleId',
    allowNull: false,
  })
  roleId: number;

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
    field: 'expiresAt',
    allowNull: true,
  })
  expiresAt: Date;

  @Column({
    type: DataTypes.BOOLEAN,
    field: 'isDefault',
    defaultValue: false,
    allowNull: false,
  })
  isDefault: boolean;

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
  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Role, 'roleId')
  role: Role;

  @BelongsTo(() => Tenant, 'tenantId')
  tenant: Tenant;
}

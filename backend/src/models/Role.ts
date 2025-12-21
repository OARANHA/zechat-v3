import {
  Table,
  Column,
  Model,
  DataTypes,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import Tenant from './Tenant';
import UserRole from './UserRole';
import RolePermission from './RolePermission';

@Table({
  tableName: 'Roles',
  underscored: false,
  timestamps: false,
})
export default class Role extends Model {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataTypes.INTEGER,
    field: 'tenantId',
    allowNull: false,
  })
  tenantId: number;

  @Column({
    type: DataTypes.STRING(100),
    field: 'name',
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataTypes.TEXT,
    field: 'description',
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataTypes.STRING(20),
    field: 'status',
    defaultValue: 'active',
    allowNull: false,
  })
  status: 'active' | 'inactive' | 'archived';

  @Column({
    type: DataTypes.BOOLEAN,
    field: 'isDefault',
    defaultValue: false,
    allowNull: false,
  })
  isDefault: boolean;

  @Column({
    type: DataTypes.JSON,
    field: 'metadata',
    allowNull: true,
  })
  metadata: Record<string, any> | null;

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
  @BelongsTo(() => Tenant, 'tenantId')
  tenant: Tenant;

  @HasMany(() => UserRole, 'roleId')
  userRoles: UserRole[];

  @HasMany(() => RolePermission, 'roleId')
  rolePermissions: RolePermission[];
}

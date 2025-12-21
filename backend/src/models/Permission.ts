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
import RolePermission from './RolePermission';

@Table({
  tableName: 'Permissions',
  underscored: false,
  timestamps: false,
})
export default class Permission extends Model {
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
    unique: true,
  })
  name: string;

  @Column({
    type: DataTypes.STRING(200),
    field: 'description',
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataTypes.STRING(50),
    field: 'scope',
    defaultValue: 'tenant',
    allowNull: false,
  })
  scope: 'tenant' | 'global' | 'system';

  @Column({
    type: DataTypes.STRING(50),
    field: 'status',
    defaultValue: 'active',
    allowNull: false,
  })
  status: 'active' | 'inactive' | 'deprecated';

  @Column({
    type: DataTypes.STRING(100),
    field: 'resource',
    allowNull: true,
  })
  resource: string;

  @Column({
    type: DataTypes.STRING(100),
    field: 'action',
    allowNull: false,
  })
  action: string;

  @Column({
    type: DataTypes.TEXT,
    field: 'conditions',
    allowNull: true,
  })
  conditions: string;

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

  @HasMany(() => RolePermission, 'permissionId')
  rolePermissions: RolePermission[];
}

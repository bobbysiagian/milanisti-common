const { SQLContext } = require('../index');

const { Model, DataTypes } = SQLContext.getORMProvider();

class SystemParameter extends Model {}

SystemParameter.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    underscored: true,
    sequelize: SQLContext.getContext(),
    paranoid: true,
    tableName: 'system_parameters'
});

module.exports = SystemParameter;

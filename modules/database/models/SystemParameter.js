const { SQLContext } = require('../index');
const moment = require('moment')

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
        allowNull: false,
        get(...args) {
            const value = this.getDataValue(args[0]);
            return value === null ? null : moment(value).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        get(...args) {
            const value = this.getDataValue(args[0]);
            return value === null ? null : moment(value).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: false,
        get(...args) {
            const value = this.getDataValue(args[0]);
            return value === null ? null : moment(value).format('YYYY-MM-DD HH:mm:ss');
        },
    }
}, {
    underscored: true,
    sequelize: SQLContext.getContext(),
    paranoid: true,
    tableName: 'system_parameters'
});

module.exports = SystemParameter;

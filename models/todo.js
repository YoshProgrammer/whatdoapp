module.exports = function (sequelize, DataTypes) {
    return sequelize.define('todo', {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            }
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        file: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3
        }
    });
};
import { DataTypes } from 'sequelize'
import sequelize from '../config/db.config.js'
// import User from './User'  // Import User model

const UserFollower = sequelize.define('UserFollower', {
  followerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  followingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, { timestamps: false });

// Define associations

export default UserFollower;

const mongoose = require('mongoose');
const validator = require('validator');

/**
 * Seller Schema
 * Represents a seller/merchant in the Nexora platform
 * Includes profile information, business details, and performance statistics
 */
const sellerSchema = new mongoose.Schema(
  {
    // Foreign key reference to User model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
    },

    // Shop Information
    shopName: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
      minlength: [3, 'Shop name must be at least 3 characters long'],
      maxlength: [100, 'Shop name cannot exceed 100 characters'],
      index: true,
    },

    shopDescription: {
      type: String,
      trim: true,
      maxlength: [1000, 'Shop description cannot exceed 1000 characters'],
      default: '',
    },

    shopImage: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return validator.isURL(v);
        },
        message: 'Shop image must be a valid URL',
      },
    },

    // Business Type
    businessType: {
      type: String,
      enum: {
        values: ['local', 'dropship'],
        message: 'Business type must be either "local" or "dropship"',
      },
      required: [true, 'Business type is required'],
      index: true,
    },

    // Commission and Payment Details
    commissionRate: {
      type: Number,
      required: [true, 'Commission rate is required'],
      min: [0, 'Commission rate cannot be negative'],
      max: [100, 'Commission rate cannot exceed 100%'],
      default: 5,
      validate: {
        validator: function (v) {
          return Number.isFinite(v);
        },
        message: 'Commission rate must be a valid number',
      },
    },

    // COD (Cash on Delivery) Settings
    codEnabled: {
      type: Boolean,
      default: true,
    },

    codCommissionRate: {
      type: Number,
      min: [0, 'COD commission rate cannot be negative'],
      max: [100, 'COD commission rate cannot exceed 100%'],
      default: 0,
    },

    // Status Management
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'blocked', 'suspended'],
        message: 'Status must be one of: pending, approved, blocked, or suspended',
      },
      default: 'pending',
      index: true,
    },

    statusReason: {
      type: String,
      default: null,
      maxlength: [500, 'Status reason cannot exceed 500 characters'],
    },

    statusChangedAt: {
      type: Date,
      default: null,
    },

    statusChangedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Bank Details
    bankDetails: {
      accountHolderName: {
        type: String,
        trim: true,
        maxlength: [100, 'Account holder name cannot exceed 100 characters'],
      },
      accountNumber: {
        type: String,
        trim: true,
        minlength: [9, 'Account number must be at least 9 characters'],
        maxlength: [18, 'Account number cannot exceed 18 characters'],
      },
      ifscCode: {
        type: String,
        uppercase: true,
        trim: true,
        match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'],
      },
      bankName: {
        type: String,
        trim: true,
        maxlength: [100, 'Bank name cannot exceed 100 characters'],
      },
      branchName: {
        type: String,
        trim: true,
        maxlength: [100, 'Branch name cannot exceed 100 characters'],
      },
      upiId: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: function (v) {
            if (!v) return true;
            return /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(v);
          },
          message: 'Invalid UPI ID format',
        },
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: {
        type: Date,
        default: null,
      },
    },

    // Address Information
    address: {
      streetAddress: {
        type: String,
        trim: true,
        maxlength: [200, 'Street address cannot exceed 200 characters'],
      },
      city: {
        type: String,
        trim: true,
        maxlength: [50, 'City name cannot exceed 50 characters'],
      },
      state: {
        type: String,
        trim: true,
        maxlength: [50, 'State name cannot exceed 50 characters'],
      },
      country: {
        type: String,
        trim: true,
        maxlength: [50, 'Country name cannot exceed 50 characters'],
        default: 'India',
      },
      zipCode: {
        type: String,
        trim: true,
        match: [/^\d{5}(?:-\d{4})?$/, 'Invalid zip/postal code format'],
      },
      gstNumber: {
        type: String,
        uppercase: true,
        trim: true,
        match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format'],
      },
      panNumber: {
        type: String,
        uppercase: true,
        trim: true,
        match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format'],
      },
    },

    // Contact Information
    contactPhone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(v);
        },
        message: 'Invalid phone number format',
      },
    },

    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return validator.isEmail(v);
        },
        message: 'Invalid email format',
      },
    },

    // Denormalized Statistics Fields
    statistics: {
      totalProducts: {
        type: Number,
        default: 0,
        min: 0,
      },
      activeProducts: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalOrders: {
        type: Number,
        default: 0,
        min: 0,
      },
      completedOrders: {
        type: Number,
        default: 0,
        min: 0,
      },
      cancelledOrders: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalEarnings: {
        type: Number,
        default: 0,
        min: 0,
      },
      pendingEarnings: {
        type: Number,
        default: 0,
        min: 0,
      },
      withdrawnAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalRatings: {
        type: Number,
        default: 0,
        min: 0,
      },
      responseRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      shippingAccuracy: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },

    // Verification Fields
    documentVerification: {
      gstVerified: {
        type: Boolean,
        default: false,
      },
      panVerified: {
        type: Boolean,
        default: false,
      },
      bankVerified: {
        type: Boolean,
        default: false,
      },
      addressVerified: {
        type: Boolean,
        default: false,
      },
      documentSubmittedAt: {
        type: Date,
        default: null,
      },
      documentVerifiedAt: {
        type: Date,
        default: null,
      },
    },

    // Compliance and Settings
    policies: {
      returnPolicy: {
        type: String,
        default: '',
        maxlength: [1000, 'Return policy cannot exceed 1000 characters'],
      },
      shippingPolicy: {
        type: String,
        default: '',
        maxlength: [1000, 'Shipping policy cannot exceed 1000 characters'],
      },
      warrantyPolicy: {
        type: String,
        default: '',
        maxlength: [1000, 'Warranty policy cannot exceed 1000 characters'],
      },
    },

    settings: {
      autoApproveOrders: {
        type: Boolean,
        default: false,
      },
      notifyOutOfStock: {
        type: Boolean,
        default: true,
      },
      allowPreOrders: {
        type: Boolean,
        default: false,
      },
      acceptReturns: {
        type: Boolean,
        default: true,
      },
    },

    // Metadata
    approvedAt: {
      type: Date,
      default: null,
      index: true,
    },

    lastActivityAt: {
      type: Date,
      default: null,
      index: true,
    },

    suspendedUntil: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: '',
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Indexes for Performance Optimization
 */
// Compound indexes for common queries
sellerSchema.index({ userId: 1, status: 1 });
sellerSchema.index({ status: 1, isActive: 1 });
sellerSchema.index({ createdAt: -1 });
sellerSchema.index({ 'statistics.averageRating': -1 });
sellerSchema.index({ 'statistics.totalOrders': -1 });
sellerSchema.index({ businessType: 1, status: 1 });
sellerSchema.index({ shopName: 'text', shopDescription: 'text' }); // Text search index

/**
 * Virtuals
 */
// Calculate seller rating category
sellerSchema.virtual('ratingCategory').get(function () {
  const rating = this.statistics.averageRating;
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4) return 'Very Good';
  if (rating >= 3.5) return 'Good';
  if (rating >= 3) return 'Average';
  return 'Poor';
});

// Check if seller is eligible for payouts
sellerSchema.virtual('isEligibleForPayout').get(function () {
  return (
    this.status === 'approved' &&
    this.isActive &&
    this.documentVerification.bankVerified &&
    this.statistics.totalEarnings > 0
  );
});

/**
 * Middleware Hooks
 */
// Hash passwords before saving (if needed for seller-specific auth)
sellerSchema.pre('save', function (next) {
  if (!this.isModified()) {
    return next();
  }

  // Mark lastActivityAt as updated
  this.lastActivityAt = new Date();
  next();
});

/**
 * Instance Methods
 */

/**
 * Approve a seller
 * @param {String} approvedBy - User ID of admin approving the seller
 * @param {String} reason - Optional approval reason
 * @returns {Promise}
 */
sellerSchema.methods.approve = async function (approvedBy, reason = '') {
  this.status = 'approved';
  this.approvedAt = new Date();
  this.statusChangedAt = new Date();
  this.statusChangedBy = approvedBy;
  this.statusReason = reason || 'Seller approved by admin';
  this.isActive = true;

  return await this.save();
};

/**
 * Block a seller
 * @param {String} blockedBy - User ID of admin blocking the seller
 * @param {String} reason - Reason for blocking
 * @returns {Promise}
 */
sellerSchema.methods.block = async function (blockedBy, reason) {
  if (!reason) {
    throw new Error('Reason for blocking is required');
  }

  this.status = 'blocked';
  this.isActive = false;
  this.statusChangedAt = new Date();
  this.statusChangedBy = blockedBy;
  this.statusReason = reason;

  return await this.save();
};

/**
 * Suspend a seller temporarily
 * @param {String} suspendedBy - User ID of admin suspending the seller
 * @param {Number} daysCount - Number of days to suspend
 * @param {String} reason - Reason for suspension
 * @returns {Promise}
 */
sellerSchema.methods.suspend = async function (suspendedBy, daysCount, reason) {
  const suspensionDate = new Date();
  suspensionDate.setDate(suspensionDate.getDate() + daysCount);

  this.status = 'suspended';
  this.suspendedUntil = suspensionDate;
  this.statusChangedAt = new Date();
  this.statusChangedBy = suspendedBy;
  this.statusReason = reason;

  return await this.save();
};

/**
 * Unsuspend a seller
 * @param {String} unsuspendedBy - User ID of admin unsuspending
 * @returns {Promise}
 */
sellerSchema.methods.unsuspend = async function (unsuspendedBy) {
  this.status = 'approved';
  this.suspendedUntil = null;
  this.statusChangedAt = new Date();
  this.statusChangedBy = unsuspendedBy;
  this.statusReason = 'Seller unsuspended by admin';
  this.isActive = true;

  return await this.save();
};

/**
 * Update commission rate
 * @param {Number} newRate - New commission rate (0-100)
 * @param {String} updatedBy - User ID of admin making the change
 * @returns {Promise}
 */
sellerSchema.methods.updateCommissionRate = async function (newRate, updatedBy) {
  if (newRate < 0 || newRate > 100) {
    throw new Error('Commission rate must be between 0 and 100');
  }

  const oldRate = this.commissionRate;
  this.commissionRate = newRate;
  this.lastActivityAt = new Date();

  // Note: In production, you might want to log this change in an audit trail
  // Example: await CommissionHistory.create({ sellerId: this._id, oldRate, newRate, updatedBy })

  return await this.save();
};

/**
 * Update COD settings
 * @param {Boolean} enabled - Enable/disable COD
 * @param {Number} codRate - COD commission rate
 * @returns {Promise}
 */
sellerSchema.methods.updateCODSettings = async function (enabled, codRate = null) {
  this.codEnabled = enabled;
  if (codRate !== null) {
    if (codRate < 0 || codRate > 100) {
      throw new Error('COD commission rate must be between 0 and 100');
    }
    this.codCommissionRate = codRate;
  }

  return await this.save();
};

/**
 * Update bank details
 * @param {Object} bankData - Bank details object
 * @returns {Promise}
 */
sellerSchema.methods.updateBankDetails = async function (bankData) {
  this.bankDetails = {
    ...this.bankDetails,
    ...bankData,
    isVerified: false, // Reset verification when details change
    verifiedAt: null,
  };

  return await this.save();
};

/**
 * Update address information
 * @param {Object} addressData - Address object
 * @returns {Promise}
 */
sellerSchema.methods.updateAddress = async function (addressData) {
  this.address = {
    ...this.address,
    ...addressData,
  };

  // Reset address verification when details change
  this.documentVerification.addressVerified = false;

  return await this.save();
};

/**
 * Update statistics
 * @param {Object} statsUpdate - Partial statistics object to update
 * @returns {Promise}
 */
sellerSchema.methods.updateStatistics = async function (statsUpdate) {
  this.statistics = {
    ...this.statistics,
    ...statsUpdate,
  };

  this.lastActivityAt = new Date();
  return await this.save();
};

/**
 * Increment product count
 * @param {Number} count - Number of products to add (default: 1)
 * @returns {Promise}
 */
sellerSchema.methods.incrementProductCount = async function (count = 1) {
  this.statistics.totalProducts += count;
  this.statistics.activeProducts += count;
  this.lastActivityAt = new Date();

  return await this.save();
};

/**
 * Decrement product count
 * @param {Number} count - Number of products to subtract (default: 1)
 * @returns {Promise}
 */
sellerSchema.methods.decrementProductCount = async function (count = 1) {
  this.statistics.totalProducts = Math.max(0, this.statistics.totalProducts - count);
  this.statistics.activeProducts = Math.max(0, this.statistics.activeProducts - count);
  this.lastActivityAt = new Date();

  return await this.save();
};

/**
 * Record a new order
 * @param {Number} amount - Order amount
 * @param {Boolean} isCompleted - Whether order is completed
 * @returns {Promise}
 */
sellerSchema.methods.recordOrder = async function (amount, isCompleted = false) {
  this.statistics.totalOrders += 1;
  if (isCompleted) {
    this.statistics.completedOrders += 1;
  }

  this.lastActivityAt = new Date();
  return await this.save();
};

/**
 * Update rating
 * @param {Number} newRating - Rating value (0-5)
 * @param {Number} increment - Increment count for averageRating calculation
 * @returns {Promise}
 */
sellerSchema.methods.updateRating = async function (newRating, increment = true) {
  if (newRating < 0 || newRating > 5) {
    throw new Error('Rating must be between 0 and 5');
  }

  const totalRatings = this.statistics.totalRatings + 1;
  const currentTotal = this.statistics.averageRating * this.statistics.totalRatings;
  const newAverage = (currentTotal + newRating) / totalRatings;

  this.statistics.averageRating = Math.round(newAverage * 100) / 100; // Round to 2 decimal places
  this.statistics.totalRatings = totalRatings;
  this.lastActivityAt = new Date();

  return await this.save();
};

/**
 * Add earnings
 * @param {Number} amount - Amount to add
 * @param {Boolean} isPending - Whether earnings are pending (default: true)
 * @returns {Promise}
 */
sellerSchema.methods.addEarnings = async function (amount, isPending = true) {
  if (amount < 0) {
    throw new Error('Earnings amount cannot be negative');
  }

  if (isPending) {
    this.statistics.pendingEarnings += amount;
  } else {
    this.statistics.totalEarnings += amount;
  }

  this.lastActivityAt = new Date();
  return await this.save();
};

/**
 * Record withdrawal
 * @param {Number} amount - Amount withdrawn
 * @returns {Promise}
 */
sellerSchema.methods.recordWithdrawal = async function (amount) {
  if (amount < 0) {
    throw new Error('Withdrawal amount cannot be negative');
  }

  if (amount > this.statistics.totalEarnings) {
    throw new Error('Insufficient earnings for withdrawal');
  }

  this.statistics.totalEarnings -= amount;
  this.statistics.withdrawnAmount += amount;
  this.lastActivityAt = new Date();

  return await this.save();
};

/**
 * Mark document as verified
 * @param {String} documentType - Type of document (gst, pan, bank, address)
 * @returns {Promise}
 */
sellerSchema.methods.markDocumentAsVerified = async function (documentType) {
  const validTypes = ['gst', 'pan', 'bank', 'address'];
  if (!validTypes.includes(documentType)) {
    throw new Error(`Invalid document type. Must be one of: ${validTypes.join(', ')}`);
  }

  const fieldMap = {
    gst: 'gstVerified',
    pan: 'panVerified',
    bank: 'bankVerified',
    address: 'addressVerified',
  };

  this.documentVerification[fieldMap[documentType]] = true;
  this.documentVerification.documentVerifiedAt = new Date();

  // If all documents are verified, update the address field verification
  if (documentType === 'bank') {
    this.bankDetails.isVerified = true;
    this.bankDetails.verifiedAt = new Date();
  }

  return await this.save();
};

/**
 * Get seller eligibility for specific features
 * @returns {Object} Eligibility status for various features
 */
sellerSchema.methods.getEligibility = function () {
  return {
    canListProducts: this.status === 'approved' && this.isActive,
    canAcceptOrders: this.status === 'approved' && this.isActive,
    canWithdrawEarnings: this.isEligibleForPayout,
    canUseCOD: this.codEnabled && this.status === 'approved',
    canAcceptDropship: this.businessType === 'dropship' && this.status === 'approved',
  };
};

/**
 * Get seller summary
 * @returns {Object} Summary of seller information
 */
sellerSchema.methods.getSummary = function () {
  return {
    id: this._id,
    userId: this.userId,
    shopName: this.shopName,
    businessType: this.businessType,
    status: this.status,
    statistics: this.statistics,
    ratingCategory: this.ratingCategory,
    isEligibleForPayout: this.isEligibleForPayout,
    createdAt: this.createdAt,
    approvedAt: this.approvedAt,
  };
};

/**
 * Static Methods
 */

/**
 * Find active sellers
 * @returns {Query}
 */
sellerSchema.statics.findActive = function () {
  return this.find({ isActive: true, status: 'approved' });
};

/**
 * Find sellers by status
 * @param {String} status - Seller status
 * @returns {Query}
 */
sellerSchema.statics.findByStatus = function (status) {
  return this.find({ status });
};

/**
 * Find top-rated sellers
 * @param {Number} limit - Number of sellers to return
 * @returns {Query}
 */
sellerSchema.statics.findTopRated = function (limit = 10) {
  return this.find({ status: 'approved', isActive: true })
    .sort({ 'statistics.averageRating': -1 })
    .limit(limit);
};

/**
 * Find pending approval sellers
 * @returns {Query}
 */
sellerSchema.statics.findPending = function () {
  return this.find({ status: 'pending' });
};

/**
 * Search sellers by shop name
 * @param {String} query - Search query
 * @returns {Query}
 */
sellerSchema.statics.searchByShopName = function (query) {
  return this.find({
    $text: { $search: query },
    status: 'approved',
    isActive: true,
  });
};

/**
 * Get seller statistics
 * @returns {Promise}
 */
sellerSchema.statics.getStatistics = async function () {
  return await this.aggregate([
    {
      $match: { status: 'approved', isActive: true },
    },
    {
      $group: {
        _id: null,
        totalSellers: { $sum: 1 },
        avgRating: { $avg: '$statistics.averageRating' },
        totalEarnings: { $sum: '$statistics.totalEarnings' },
        totalOrders: { $sum: '$statistics.totalOrders' },
      },
    },
  ]);
};

/**
 * Model Export
 */
const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;

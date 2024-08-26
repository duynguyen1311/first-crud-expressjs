const validator = require('validator');

class Helper {
    getPagination(page, size) {
        const limit = size && !isNaN(Number(size)) ? Math.max(Number(size), 1) : 10;
        const offset = page ? (page - 1) * limit : 0;

        return { limit, offset };
    }

    getPagingData(data, page, limit) {
        const { count: totalItems, rows: items } = data;
        const currentPage = page ? +page : 1;
        const totalPages = Math.ceil(totalItems / limit);

        return { totalItems, items, totalPages, currentPage };
    }

    isValidEmail(email) {
        return validator.isEmail(email);
    }

    isValidPassword(password) {
        // At least 6 characters, 1 uppercase, and 1 special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
        return passwordRegex.test(password);
    }

    isValidUsername(username) {
        // Alphanumeric, 3-20 characters
        const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
        return usernameRegex.test(username);
    }

    isValidId(id) {
        return validator.isInt(id.toString());
    }

    isValidString(str) {
        return typeof str === 'string' && str.trim().length > 0;
    }
    validatePostQuery(categoryId, userId, keyword, page, size) {
        const errors = {};

        if (categoryId !== undefined) {
            if (!this.isValidId(categoryId)) {
                errors.categoryId = 'Category ID must be a valid integer.';
            }
        }

        if (userId !== undefined) {
            if (!this.isValidId(userId)) {
                errors.userId = 'User ID must be a valid integer.';
            }
        }

        if (page !== undefined) {
            if (!this.isValidId(page) || parseInt(page) < 1) {
                errors.page = 'Page must be a positive integer.';
            }
        }

        if (size !== undefined) {
            if (!this.isValidId(size) || parseInt(size) < 1) {
                errors.size = 'Size must be a positive integer.';
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }
    validateUserInput(data) {
        const errors = {};

        if (!data.username || !this.isValidUsername(data.username)) {
            errors.username = 'Invalid username. It should be 3-20 alphanumeric characters.';
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.email = 'Invalid email address.';
        }

        if (!data.password || !this.isValidPassword(data.password)) {
            errors.password = 'Invalid password. It should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.';
        }
        if (!data.username || !data.email || !data.password) {
            errors.required = 'Username, email, and password are required.';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    validatePostInput({ title, content, category_id, tagIds }) {
        const errors = {};

        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            errors.title = 'Title is required and must be a non-empty string.';
        }

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            errors.content = 'Content is required and must be a non-empty string.';
        }

        if (!category_id || !Number.isInteger(category_id) || category_id <= 0) {
            errors.category_id = 'Category ID is required and must be a positive integer.';
        }

        if (!Array.isArray(tagIds)) {
            errors.tagIds = 'TagIds must be an array.';
        } else if (tagIds.length === 0) {
            errors.tagIds = 'At least one tag ID is required.';
        } else if (!tagIds.every(id => Number.isInteger(id) && id > 0)) {
            errors.tagIds = 'All tag IDs must be positive integers.';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }
    validateLoginInput(data) {
        const errors = {};

        if (!data.email) {
            errors.email = 'Email is required.';
        } else if (!this.isValidEmail(data.email)) {
            errors.email = 'Invalid email format.';
        }

        if (!data.password) {
            errors.password = 'Password is required.';
        } else if (data.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long.';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }
}

module.exports = new Helper();
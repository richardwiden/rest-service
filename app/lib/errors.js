'use strict';

let errors = require('restify-errors');
//intellij, shut up
//noinspection SillyAssignmentJS
/**
 * 401 UnauthorizedError
 */
errors.UnauthorizedError = errors.UnauthorizedError;

//noinspection SillyAssignmentJS
/**
 * 403 ForbiddenError
 */
errors.ForbiddenError = errors.ForbiddenError;

//noinspection SillyAssignmentJS
/**
 * 500 InternalServerError
 */
errors.InternalServerError = errors.InternalServerError;


module.exports = errors;
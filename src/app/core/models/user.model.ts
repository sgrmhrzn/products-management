import { RoleEnum } from "../../enum/role.enum";

/**
 * Holds user information
 */
export interface IUserModel {
    id: string;
    name: string;
    username?: string;
    password?: string;
    canDelete?: boolean;
    role?: RoleEnum;
    createdDate?: Date;
}

/**
 * Holds user assignment information in the role
 */
export interface IUserAssignModel {
    id: string;
    role: RoleEnum;
    userIds: Array<string>;
}

/**
 * Holds the active user information 
 */
export interface IActiveUserModel {
    id?: string;
    name?: string;
    username?: string;
    role?: RoleEnum;
    createdDate?: Date;
}

/**
 * Holds the log in information
 */
export interface ILogInUserModel {
    username: string;
    password: string;
}
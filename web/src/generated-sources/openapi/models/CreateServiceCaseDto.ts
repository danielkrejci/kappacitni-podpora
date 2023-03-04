/* tslint:disable */
/* eslint-disable */
/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface CreateServiceCaseDto
 */
export interface CreateServiceCaseDto {
    /**
     * 
     * @type {string}
     * @memberof CreateServiceCaseDto
     */
    deviceName?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateServiceCaseDto
     */
    caseType?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateServiceCaseDto
     */
    serialNumber?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateServiceCaseDto
     */
    message?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateServiceCaseDto
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateServiceCaseDto
     */
    surname?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateServiceCaseDto
     */
    email?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateServiceCaseDto
     */
    phone?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateServiceCaseDto
     */
    street?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateServiceCaseDto
     */
    houseNumber?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateServiceCaseDto
     */
    city?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateServiceCaseDto
     */
    postalCode?: string;
}

/**
 * Check if a given object implements the CreateServiceCaseDto interface.
 */
export function instanceOfCreateServiceCaseDto(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function CreateServiceCaseDtoFromJSON(json: any): CreateServiceCaseDto {
    return CreateServiceCaseDtoFromJSONTyped(json, false);
}

export function CreateServiceCaseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateServiceCaseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'deviceName': !exists(json, 'deviceName') ? undefined : json['deviceName'],
        'caseType': !exists(json, 'caseType') ? undefined : json['caseType'],
        'serialNumber': !exists(json, 'serialNumber') ? undefined : json['serialNumber'],
        'message': !exists(json, 'message') ? undefined : json['message'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'surname': !exists(json, 'surname') ? undefined : json['surname'],
        'email': !exists(json, 'email') ? undefined : json['email'],
        'phone': !exists(json, 'phone') ? undefined : json['phone'],
        'street': !exists(json, 'street') ? undefined : json['street'],
        'houseNumber': !exists(json, 'houseNumber') ? undefined : json['houseNumber'],
        'city': !exists(json, 'city') ? undefined : json['city'],
        'postalCode': !exists(json, 'postalCode') ? undefined : json['postalCode'],
    };
}

export function CreateServiceCaseDtoToJSON(value?: CreateServiceCaseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'deviceName': value.deviceName,
        'caseType': value.caseType,
        'serialNumber': value.serialNumber,
        'message': value.message,
        'name': value.name,
        'surname': value.surname,
        'email': value.email,
        'phone': value.phone,
        'street': value.street,
        'houseNumber': value.houseNumber,
        'city': value.city,
        'postalCode': value.postalCode,
    };
}


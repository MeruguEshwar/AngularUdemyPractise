import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { departments } from '../../../assets/fakebackend.json'
import { designations } from '../../../assets/fakebackend.json'
import { users } from '../../../assets/fakebackend.json';
// array in local storage for registered users

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('api/user/login') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                case url.match('api/department/all') && method == 'GET':
                    return getDepartments();
                case url.match('api/department/add') && method == 'POST':
                    return addDepartment();
                case url.match('api/department/update') && method == 'POST':
                    return updateDepartemnt();
                case url.match('api/department/exists') && method == 'GET':
                    return isDepartmentExists();
                case url.match('api/designation/all') && method == 'GET':
                    return getDesignations();
                case url.match('api/designation/add') && method == 'POST':
                    return addDesignation();
                case url.match('api/designation/update') && method == 'POST':
                    return updateDesignation();
                case url.match('api/designation/exists') && method == 'GET':
                    return isDesignationExists();

                case url.match('api/employee/all') && method == 'GET':
                    return getEmployees();
                case url.match('api/employee/add') && method == 'POST':
                    return addEmployee();
                case url.match('api/employee/update') && method == 'POST':
                    return updateEmployee();
                case url.match('api/employee/exists') && method == 'GET':
                    return isEmployeeExists();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { email, password } = body;
            const user = users.find(x => x.employeeid === email && x.password == password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.employeeid,
                username: user.name,
                firstName: user.employeeid,
                lastName: user.employeeid,
                token: 'fake-jwt-token',
                role: user.role
            })
        }

        function getDepartments() {
            return ok(departments)
        }
        function addDepartment() {
            departments.push(body);
            return ok();
        }
        function updateDepartemnt() {
            let dept = body;
            departments.forEach(value => {
                if (value.id == dept.id) {
                    value.name = dept.name;
                    value.description = dept.description;
                }
            })
            return ok();
        }
        function isDepartmentExists() {
            let deptName = request.urlWithParams.split('=')[1];
            let isExists = departments.filter(item => item.name == deptName).length > 0;
            if (isExists == false)
                return ok();
            else
                return throwError(`department ${deptName}already exists`);
        }
        function getDesignations() {
            return ok(designations)
        }
        function addDesignation() {
            body.id = designations.length + 1;
            body.status = 'Active';
            designations.push(body);
            return ok();
        }
        function updateDesignation() {
            let dept = body;
            designations.forEach(value => {
                if (value.id == dept.id) {
                    value.name = dept.name;
                    value.description = dept.description;
                }
            })
            return ok();
        }
        function isDesignationExists() {
            let designName = request.urlWithParams.split('=')[1];
            let isExists = designations.filter(item => item.name == designName).length > 0;
            if (isExists == false)
                return ok();
            else
                return throwError(`department ${designName}already exists`);
        }

        function getEmployees() {
            return ok(users)
        }
        function addEmployee() {
            body.id = users.length + 1;
            body.status = 'Active';
            users.push(body);
            return ok();
        }
        function updateEmployee() {
            let user = body;
            users.forEach(value => {
                if (value.id == user.id) {
                    value = user;
                }
            })
            return ok();
        }
        function isEmployeeExists() {
            let userName = request.urlWithParams.split('=')[1];
            let isExists = users.filter(item => item.name == userName).length > 0;
            if (isExists == false)
                return ok();
            else
                return throwError(`department ${userName}already exists`);
        }
        function register() {
            const user = body

            if (users.find(x => x.name === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            let user = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
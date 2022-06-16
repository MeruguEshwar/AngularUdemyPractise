import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@app/shared/models/api-response.model';
import { Department } from '@app/shared/models/department.model';

@Injectable({
    providedIn:'root'
})
export class DepartmentService
{
    constructor(private http:HttpClient){

    }
    getAllDepartments(status:number){
        return this.http.get<ApiResponse<Department>>(`api/department/all?status=${status}`);
    }
    getDepartment(departmentDetailsId:string){
        return this.http.get<ApiResponse<Department>>(`api/department/${departmentDetailsId}`);
    }
    addDepartment(department:any){
         
        return this.http.post<ApiResponse<Department>>(`api/department/add`,department);
    }
    updateDepartment(department:Department){
        return this.http.put<ApiResponse<Department>>('api/department/update',department)
    }
    activateDepartment(departmentDetailsId:number){
        return this.http.put<ApiResponse<Department>>(`api/department/activate/${departmentDetailsId}`,{})
    }
    deactivateDepartment(departmentDetailsId:number){
        return this.http.put<ApiResponse<Department>>(`api/department/deactivate/${departmentDetailsId}`,{})
    }
    isDepartmentExists(department:string){
        return this.http.get<ApiResponse<Department>>(`api/department/exists?department=${department}`)
    }
}
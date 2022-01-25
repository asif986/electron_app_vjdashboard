import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface AttendanceReport {

  id?: string,
  name?: string,
  departmentname?: string,
  department_id?:any,
  office?: string,
  remark?: string,
  inTime?: string,
  outTime?: string,
  location?: string,
  main_requests_id?: any,
  email?: any,
  farvision_id?: any,
  role?: any,
  office_id?: any,
  default_location?: any,
  department_name?: any,
  main_requests?: any,
  office_name?:any,
  mobile_no?:any,
  reporting_manager_id?:any,
  hr_id?:any,
  hod_id?:any,
  password?:any,
  dateofbirth?:any,
  workanniversary?:any
  workingslot?:any,
  intime?:any,
  full_intime?:any,
  full_outtime?:any

}

export interface ColumnItem {
  name: string;
  sortOrder?: NzTableSortOrder | null;
  sortFn?: NzTableSortFn | null;
  listOfFilter?: NzTableFilterList | any;
  filterFn?: NzTableFilterFn | null | any;
  filterMultiple?: boolean;
  sortDirections?: NzTableSortOrder[];
}


export interface Location {
  administrativeArea: string,
  areasOfInterest: Array<string>,
  countryCode: string,
  countryName: string,
  latitude: number,
  locality: string,
  longitude: number,
  postalCode: string,
  subAdministrativeArea: string,
  subLocality: any,
  subThoroughfare: string,
  thoroughfare: string
}

export interface userInfoData {
  id?: string,
  name?: string,
  email?: string,
  reporting_manager_name?: string,
  mobile_no?: any,
  default_location?: any,
  department_name?: any,
  update?: any,
  department_id: any,
  reporting_manager_id: any,
  office_id: any,
  farvision_id: any,
  role: any,
  hr_id: any,
  hod_id:any,
  intime: any,
  outtime,
  date: any;
  approvel_status: any



}

export interface CardCount {

  body: { pcount };
}

export interface Office {
  office_id?: any,
  office_name?: any
}
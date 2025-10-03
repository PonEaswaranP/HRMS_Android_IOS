export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  Attendance: undefined;
  EmployeeList: undefined;
  EmployeeProfile: { employeeId: number };
  LeaveList: undefined;
  LeaveApplication: undefined;
  PayslipList: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

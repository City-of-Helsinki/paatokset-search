export default function useDepartmentClasses(departmentArray: string[]|undefined) {
  let department;
  if(departmentArray && departmentArray.length >= 0) {
    department = departmentArray[0];
  }

  if(department === 'Viranhaltija' || department === 'Luottamushenkilö') {
    return 'trustee';
  }
  if(department === 'Lautakunta' || department === 'Jaosto' || department === 'Hallitus') {
    return 'board'
  }
  if(department === 'Valtuusto') {
    return 'council'
  }
  if(department === 'Toimi-/Neuvottelukunta') {
    return 'committee';
  }
}
/**
 * Calculates current age dynamically based on birthdate.
 * Birthday: June 14, 2006 (14-06-2006)
 */
export const calculateAge = (birthDateString = "2006-06-14") => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export default calculateAge;

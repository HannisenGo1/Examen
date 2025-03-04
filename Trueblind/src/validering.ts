export const validateFormData = (step: number, formData: any) => {
  let errors: any = {};

  if (step >= 1) {  
    if (!formData.firstName) errors.firstName = 'Förnamn är obligatoriskt.';
    if (!formData.password) {
      errors.password = 'Lösenord är obligatoriskt.';
    } else {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d|[^a-zA-Z\d]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        errors.password = 'Lösenordet måste vara minst 8 tecken långt, innehålla minst en stor bokstav och ett nummer eller specialtecken.';
      }
    }

    if (!formData.age || !formData.age.month || !formData.age.day || !formData.age.year) {
      errors.age = 'Ålder måste anges.';
    } else {
      const { month, day, year } = formData.age;

      const birthDate = new Date(year, month - 1, day); 
      const currentDate = new Date();


      let age = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDifference = currentDate.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        errors.age = 'Ålder måste vara minst 18.';
      }
    }
    if (formData.age.year && (formData.age.year.length !== 4 || isNaN(Number(formData.age.year)))) {
      errors.year = 'Året måste vara ett giltigt fyra-siffrigt tal.';
    }
    if (!formData.city) errors.city = 'Stad är obligatoriskt.';
    if (!formData.email) errors.email = 'Epost är obligatoriskt';
  }

  if (step >= 2) {  
    if (!formData.gender) errors.gender = 'Kön är obligatoriskt.';
    if (!formData.sexualOrientation) errors.sexualOrientation = 'Sexuell läggning är obligatoriskt.';
  }

  if (step >= 3) { 
      if (!formData.religion) errors.religion = 'Religion är obligatoriskt.';
      if (formData.interests.length < 5) errors.interests = 'Välj fem intressen.'; 
  }

  if (step >= 4) { 
    if (formData.hasChildren === undefined) errors.hasChildren = 'Du måste svara på om du har barn.';
    if (formData.wantsChildren === undefined) errors.wantsChildren = 'Du måste svara på om du vill ha barn.';
    if (formData.smokes === undefined) errors.smokes = 'Du måste svara på om du röker.';
  }

  if (step >= 5) { 
    if (!formData.relationshipStatus) errors.relationshipStatus = 'Vad söker du? är obligatoriskt.';
    if (!formData.education) errors.education = 'Utbildningsnivå är obligatoriskt.';
  }

  if (step >= 6) {  
    if (!formData.favoriteSong) errors.favoriteSong = 'Favorit låt är obligatoriskt.'; 
    if (!formData.favoriteMovie) errors.favoriteMovie = 'Favorit film är obligatoriskt.'; 
  }

  return errors;
};
  export const intresseLista = [
    'Sport', 'Musik', 'Läsa', 'Resor', 'Matlagning', 
    'Fotboll', 'Basket', 'Film', 'Teater', 'Djur', 
    'Natur', 'Träning', 'Målning', 'Skulptur', 'Spel',
    'Teknik', 'Politik', 'Historia', 'Fotografi', 'Mode',
    'Mat', 'Vin', 'Yoga', 'Poesi', 'Podcast', 'Hälsa', 
    'Filosofi', 'Jakt', 'Fiska', 'Bilar', 'Kaffe', 'Träna','Hundar', 'katter',
    'Xbox', 'Pc' , 'playstation' , 'Vr', 'Sjunga', 'Vänner', 'Youtube',
     'Sociala aktiviteter',
     'Baka', 'Tennis'
  ];
 
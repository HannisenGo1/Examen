type Errors = {
  [key: string]: string; 
};


export const validateFormData = (step: number, formData: any) => {
  const errors: Errors = {};

  if (step === 1) {

    if (!formData.firstName) {
      errors.firstName = 'Förnamn är obligatoriskt.';
    }

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

    if (!formData.city) {
      errors.city = 'Stad är obligatoriskt.';
    }

    if (!formData.email) {
      errors.email = 'Epost är obligatoriskt.';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|se|net|nu)$/i;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Epost är inte korrekt.';
      }
    }
  }


  if (step === 2) {

    if (!formData.gender) errors.gender = 'Välj kön';
    if (!formData.sexualOrientation) errors.sexualOrientation = 'Välj sexuell läggning';
  }

  if (step === 3) {

    if (!formData.religion) errors.religion = 'Välj religion';
    if (formData.interests.length === 0) errors.interests = 'Välj minst ett intresse';
  }

  if (step === 4) {

    if (formData.hasChildren === null) errors.hasChildren = 'Välj om du har barn';
    if (formData.smokes === null) errors.smokes = 'Välj om du röker';
  }

  if (step === 5) {
  
    if (!formData.relationshipStatus) errors.relationshipStatus = 'Välj vad du söker';
    if (!formData.education) errors.education = 'Välj utbildningsnivå';
  }

  if (step === 6) {

    if (!formData.favoriteSong) errors.favoriteSong = 'Skriv din favoritlåt';
    if (!formData.favoriteMovie) errors.favoriteMovie = 'Skriv din favoritfilm';
    if (!formData.lifeStatement1 || !formData.lifeStatement2) {
      errors.lifeStatements = 'Fyll i dina livsfilosofier';
    }
    if (!formData.agreeTerms) errors.agreeTerms = 'Du måste godkänna användarvillkoren';
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
 
type Errors = {
  [key: string]: string; 
};

export const validateFormData = (step: number, formData: any) => {
  const errors: Errors = {};
  let valid = true;

  if (step === 1) {
    // Förnamn validering
    if (!formData.firstName) {
      errors.firstName = 'Förnamn är obligatoriskt.';
      valid = false;
    }

    // Lösenord validering
    if (!formData.password) {
      errors.password = 'Lösenord är obligatoriskt.';
      valid = false;
    } else {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d|[^a-zA-Z\d]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        errors.password = 'Lösenordet måste vara minst 8 tecken långt, innehålla minst en stor bokstav och ett nummer eller specialtecken.';
        valid = false;
      }
    }

    // Åldersvalidering
    if (!formData.age || !formData.age.month || !formData.age.day || !formData.age.year) {
      errors.age = 'Ålder måste anges.';
      valid = false;
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
        valid = false;
      }
    }

    // Stad validering
    if (!formData.city) {
      errors.city = 'Stad är obligatoriskt.';
      valid = false;
    }

    // E-postvalidering
    if (!formData.email) {
      errors.email = 'Epost är obligatoriskt.';
      valid = false;
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|se|net|nu)$/i;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Epost är inte korrekt.';
        valid = false;
      }
    }
  }

  // Steg 2
  if (step === 2) {
    if (!formData.gender) {
      errors.gender = 'Välj kön';
      valid = false;
    }
    if (!formData.sexualOrientation) {
      errors.sexualOrientation = 'Välj sexuell läggning';
      valid = false;
    }
  }

  // Steg 3
  if (step === 3) {
    if (!formData.religion) {
      errors.religion = 'Välj religion';
      valid = false;
    }
    if (formData.interests.length < 5) {
      errors.interests = 'Du måste välja minst 5 intressen.';
      valid = false;
    }
  }

  // Steg 4
  if (step === 4) {
    if (formData.hasChildren === null) {
      errors.hasChildren = 'Välj om du har barn';
      valid = false;
    }
    if (formData.smokes === null) {
      errors.smokes = 'Välj om du röker';
      valid = false;
    }
  }

  // Steg 5
  if (step === 5) {
    if (!formData.relationshipStatus) {
      errors.relationshipStatus = 'Välj vad du söker';
      valid = false;
    }
    if (!formData.education) {
      errors.education = 'Välj utbildningsnivå';
      valid = false;
    }
  }

  // Steg 6
  if (step === 6) {
    if (!formData.favoriteSong) {
      errors.favoriteSong = 'Skriv din favoritlåt';
      valid = false;
    }
    if (!formData.favoriteMovie) {
      errors.favoriteMovie = 'Skriv din favoritfilm';
      valid = false;
    }
    if (!formData.lifeStatement1 || !formData.lifeStatement2) {
      errors.lifeStatements = 'Fyll i dina livsfilosofier';
      valid = false;
    }
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'Du måste godkänna användarvillkoren';
    
    }
  }

  // Retur av felmeddelanden
  return valid ? {} : errors;
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
 
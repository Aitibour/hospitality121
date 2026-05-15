export type Locale = 'en' | 'fr'

export const translations = {
  en: {
    nav: {
      home: 'HOME', news: 'NEWS', podcasts: 'PODCASTS', insights: 'INSIGHTS',
      events: 'EVENTS', blog: 'BLOG', contact: 'CONTACT', subscribe: 'Subscribe',
    },
    sections: {
      insights: {
        title: 'INSIGHTS',
        description: 'Expert perspectives, industry analysis, and thought leadership from hospitality\'s brightest minds.',
        noun: 'article',
      },
      podcasts: {
        title: 'PODCASTS',
        description: 'Real conversations with the leaders shaping the future of hospitality.',
        noun: 'episode',
      },
      news: {
        title: 'NEWS',
        description: 'Breaking news, industry updates, and the stories shaping the future of global hospitality.',
        noun: 'story',
        pluralNoun: 'stories',
      },
      events: {
        title: 'EVENTS',
        description: 'Summits, conferences, and forums where hospitality\'s leaders connect, learn, and shape the industry.',
        noun: 'event',
      },
      blog: {
        title: 'BLOG',
        description: 'In-depth perspectives, practical guides, and original thinking from the Hospitality121 team.',
        noun: 'post',
      },
    },
    home: {
      editorsPick: "EDITOR'S PICK",
      topArticles: 'TOP ARTICLES',
      topPodcasts: 'TOP PODCASTS',
      seeMore: 'SEE MORE',
      seeAll: 'SEE ALL',
    },
    newsletter: {
      label: 'Newsletter',
      title: 'Stay in the know.',
      description: 'The best hospitality insights, podcasts, and events — delivered to your inbox weekly.',
      placeholder: 'Your email address',
      cta: 'SUBSCRIBE FREE',
      noSpam: 'No spam. Unsubscribe anytime.',
      successTitle: "You're in.",
      successBody: 'Welcome to the Hospitality121 community.',
    },
    contact: {
      title: 'GET IN TOUCH',
      tagline: 'Have a story to share? Want to collaborate or advertise? We\'d love to hear from you.',
      name: 'Name', email: 'Email', message: 'Message',
      send: 'Send Message', sending: 'Sending…',
      thanks: 'Thanks!', thanksMsg: "We'll be in touch soon.",
      error: 'Something went wrong. Please try again.',
    },
    footer: {
      tagline: 'Real Leaders. Real Conversations. Real Impact.',
      rights: 'All rights reserved.',
    },
  },
  fr: {
    nav: {
      home: 'ACCUEIL', news: 'ACTUALITÉS', podcasts: 'PODCASTS', insights: 'ANALYSES',
      events: 'ÉVÉNEMENTS', blog: 'BLOG', contact: 'CONTACT', subscribe: "S'abonner",
    },
    sections: {
      insights: {
        title: 'ANALYSES',
        description: 'Perspectives d\'experts, analyses sectorielles et leadership éclairé des esprits les plus brillants de l\'hôtellerie.',
        noun: 'article',
      },
      podcasts: {
        title: 'PODCASTS',
        description: 'Des conversations authentiques avec les leaders qui façonnent l\'avenir de l\'hôtellerie.',
        noun: 'épisode',
      },
      news: {
        title: 'ACTUALITÉS',
        description: 'Dernières nouvelles, mises à jour sectorielles et histoires qui façonnent l\'avenir de l\'hôtellerie mondiale.',
        noun: 'article',
        pluralNoun: 'articles',
      },
      events: {
        title: 'ÉVÉNEMENTS',
        description: 'Sommets, conférences et forums où les leaders de l\'hôtellerie se connectent, apprennent et façonnent le secteur.',
        noun: 'événement',
      },
      blog: {
        title: 'BLOG',
        description: 'Perspectives approfondies, guides pratiques et réflexions originales de l\'équipe Hospitality121.',
        noun: 'article',
      },
    },
    home: {
      editorsPick: 'SÉLECTION RÉDACTION',
      topArticles: 'TOP ARTICLES',
      topPodcasts: 'TOP PODCASTS',
      seeMore: 'VOIR PLUS',
      seeAll: 'TOUT VOIR',
    },
    newsletter: {
      label: 'Newsletter',
      title: 'Restez informé.',
      description: 'Les meilleures analyses, podcasts et événements hôteliers — livrés dans votre boîte chaque semaine.',
      placeholder: 'Votre adresse email',
      cta: "S'ABONNER GRATUITEMENT",
      noSpam: 'Pas de spam. Désabonnement à tout moment.',
      successTitle: 'Vous êtes inscrit.',
      successBody: 'Bienvenue dans la communauté Hospitality121.',
    },
    contact: {
      title: 'CONTACTEZ-NOUS',
      tagline: 'Une histoire à partager ? Envie de collaborer ou d\'annoncer ? Nous serions ravis de vous entendre.',
      name: 'Nom', email: 'Email', message: 'Message',
      send: 'Envoyer', sending: 'Envoi en cours…',
      thanks: 'Merci !', thanksMsg: 'Nous vous contacterons bientôt.',
      error: 'Une erreur est survenue. Veuillez réessayer.',
    },
    footer: {
      tagline: 'Vrais Leaders. Vraies Conversations. Vrai Impact.',
      rights: 'Tous droits réservés.',
    },
  },
}

export type Translations = typeof translations['en']

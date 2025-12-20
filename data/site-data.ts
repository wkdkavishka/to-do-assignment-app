// data/site-data.ts

export interface Authour {
	about: {
		name: string;
		description: string;
		Address: string;
	};
	socialData: {
		facebook: string;
		twitter: string;
		linkedin: string;
		whatsapp: string;
		email: string;
		website: string;
		Phone: string;
		Email: string;
	};
}

export const authorData: Authour = {
	about: {
		name: "W.K.D.Kavishka",
		description: "Software Engineer",
		Address: "Anuradhapura/ Sri Lanka",
	},
	socialData: {
		facebook: "https://www.facebook.com/wkdkavishka",
		twitter: "https://twitter.com/wkdkavishka",
		linkedin: "https://www.linkedin.com/in/wkdkavishka",
		whatsapp: "+94 75 767 6968",
		email: "w.k.d.kavishka@gmail.com",
		website: "https://wkdkavishka.com",
		Phone: "+94 75 767 6968",
		Email: "w.k.d.kavishka@gmail.com",
	},
};

export interface SiteDataInterface {
	authorData: Authour;
}

export const siteData: SiteDataInterface = {
	authorData: authorData,
};



export interface SeoData {
	siteUrl: string;
	siteName: string;
	description: string;
	keywords: string[];
	social: {
		email?: string;
		phone?: string;
		whatsapp?: string;
	};
	images: {
		logo: string;
		ogImage: string;
		appleIcon: string;
	};
}


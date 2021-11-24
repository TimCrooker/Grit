const BOTSEA_LOGOS = 'botsea/branding/logo/'
const FRAMEWORK_LOGOS = 'perfect-boilerplate/frameworks/logos/'
const DATABASE_LOGOS = 'perfect-boilerplate/databases/logos/'
const FEATURE_LOGOS = 'perfect-boilerplate/plugins/logos/'
const URL_PREFIX =
	'https://res.cloudinary.com/dfmg5c8l9/image/upload/v1631209481/'

export function cloudinaryUrl(publicId: string): string {
	return URL_PREFIX + publicId
}

export const GetFrameworkLogoId = (publicId: string): string => {
	return FRAMEWORK_LOGOS + publicId
}

export const GetFeatureLogoId = (publicId: string): string => {
	return FEATURE_LOGOS + publicId
}

export const GetDatabaseLogoId = (publicId: string): string => {
	return DATABASE_LOGOS + publicId
}

export const IMAGES = {
	social_logo: BOTSEA_LOGOS + 'social_icon',

	full_logo: BOTSEA_LOGOS + 'full',

	icon_logo: BOTSEA_LOGOS + 'icon',
}

export default IMAGES

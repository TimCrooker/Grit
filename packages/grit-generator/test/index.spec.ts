import { getGenerator } from 'gritenv';
import path from 'path'

const generator = path.resolve(__dirname, '../')

describe('Generator variations', () => {
	it('Should render with plugins', async () => {
		const grit = await getGenerator({
			generator,
			mock: true,
			answers: {
				name: 'test',
				description: 'test',
				pluginTemplate: true,
				username: 'test',
				email: 'test',
				website: 'test',
			}
		})
		await grit.run()
	
		expect(await grit.getOutputFiles()).toMatchSnapshot()
	})
	
	it('Should render without plugins', async () => {
		const grit = await getGenerator({
			generator,
			mock: true,
			answers: {
				name: 'test',
				description: 'test',
				pluginTemplate: false,
				username: 'test',
				email: 'test',
				website: 'test',
			}
		})
		await grit.run()
	
		expect(await grit.getOutputFiles()).toMatchSnapshot()
	})
});



"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    actions() {
        return [
            this.createAction.add({
                files: '**',
                data: (context) => ({ name: 'Tim' }),
            }),
            this.createAction.move({
                patterns: {
                    'bar.json': 'buz.json',
                },
            }),
        ];
    },
};

declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;

    export interface ComputedStyle {
        [key: string]: string;
    }
    export interface ComputedClass {
        [key: string]: boolean;
    }
}

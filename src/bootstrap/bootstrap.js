
class Environment {

    static instance;

    static loadEnvironment(env) {
        Environment.instance = env;
    }
}

export default Environment;
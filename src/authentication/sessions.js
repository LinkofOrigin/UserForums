import DBInstance from "../database/db";

class Session {
    DEFAULT_DURATION = 24 * 60 * 60 * 1000; // 24 hours, in milliseconds
    user_id = "";
    token = "";
    expiration = "";

    constructor(user_id) {
        this.user_id = user_id;
        this.token = this.createToken();
        this.expiration = this.getExpirationFor(this.DEFAULT_DURATION);
    }

    createToken() {
        const newToken = crypto.randomUUID();
        return newToken;
    }

    getExpirationFor(duration) {
        let currTimestamp = new Date();
        let expirationTimestamp = currTimestamp + duration;
        let expirationDate = new Date(expirationTimestamp);
        let expirationISO = expirationDate.toISOString();
        return expirationISO;
    }

    async save() {
        // Check if this user has a session already
        const selectResult = await DBInstance.select('sessions', [], { 'user_id': this.user_id });
        console.log(`Session check result: ${JSON.stringify(selectResult)}`);
        if (selectResult.length > 0) {
            // Delete existing sessions
            for (let i = 0; i < selectResult.length; i++) {
                const existingSession = selectResult[i];
                const deleteResult = await DBInstance.delete('sessions', { 'id': existingSession.id });
                console.log(`Deleted session for user. User=${this.user_id} | ID=${existingSession.id}`);
            }
        }
        const saveResult = await DBInstance.insert('sessions', ['user_id', 'token', 'expiration'], [this.user_id, this.token, this.expiration]);
        console.log(`Saved new session for user with id=${this.user_id}`);
        return saveResult;
    }
}

export default Session;
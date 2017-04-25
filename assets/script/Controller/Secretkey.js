cc.Class({
    extends: cc.Component,

    properties: {
        input: cc.EditBox,
        info: cc.Label,
    },

    // use this for initialization
    onLoad() {

    },

    loginOnClick() {
        window.SoundEffect.playEffect(Global.audioUrl.effect.buttonClick);
        if (this.input.string.length !== 6) {
            Dialog.openMessageBox('秘钥长度必须为6');
            return;
        }

        cc.director.getScene().getChildByName('Canvas').getComponent('LoginScene').httpLogin(this.input.string, 'authCodeLogin');
    },

    closeOnClick() {
        window.SoundEffect.playEffect(Global.audioUrl.effect.buttonClick);
        Global.closeDialog(this.node);
    },
});

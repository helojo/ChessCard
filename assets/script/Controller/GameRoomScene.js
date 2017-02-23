cc.Class({
    extends: cc.Component,

    properties: {
        /**
         * 0: 玩家1
         * 1: 玩家24
         * 3: 玩家3
         */
        handCardPrefabs: {
            default: [],
            type: cc.Prefab
        },

        handCardPlayers: {
            default: [],
            type: cc.Node,
        },

        playerInfoList: {
            default: [],
            type: cc.Node,
        },

        inviteButtonList: {
            default: [],
            type: cc.Node,
        },

        chatList: {
            default: [],
            type: cc.Node,
        },

        roomInfo: {
            default: [],
            type: cc.Label   
        },

        waitPanel: cc.Node,

        fastChatPanel: cc.Node,

        menuPanel: cc.Node,

        hupaiPrompt: cc.Node,

        bonusPoint: cc.Label,

        fastChatProgressBar: cc.ProgressBar,

        voiceProgressBar: cc.ProgressBar,

        wechatInviteButton: cc.Button,

        actionPanel: {
            default: [],
            type: cc.Node
        }
    },

    onLoad: function () {
        this.emojiNode = cc.Node;
        this.fastChatShowTime = +new Date();

        this.fastChatPanelPosition = this.fastChatPanel.position;
        this.menuPanelPosition = this.menuPanel.position;

        this.fastChatAudio = window.Tools.audioEngine.init();
        
        for (let i = 0; i < 14; ++i) {
            var node = cc.instantiate(this.handCardPrefabs[0]);
            if (i === 0) {
                node.getChildByName("background").setPositionX(24);
            }
            this.handCardPlayers[0].addChild(node);
        }
    },

    update: function(dt) {
        this.roomInfo[0].string = Tools.formatDatetime("hh:ii:ss");

        // 每次聊天的冷却时间
        if (+new Date() > PX258.fastChatShowTime + this.fastChatShowTime) {
            if (this.emojiNode.isValid) {
                this.emojiNode.destroy();
            }
        }

        if (this.fastChatProgressBar.progress <= 1.0 && this.fastChatProgressBar.progress >= 0) {
            this.fastChatProgressBar.progress -= dt * window.PX258.fastChatWaitTime;
        }

        if (this.voiceProgressBar.progress <= 1.0 && this.voiceProgressBar.progress >= 0) {
            this.voiceProgressBar.progress -= dt * window.PX258.fastChatWaitTime;
        }
    },

    wechatInviteOnClick: function() {
        window.Tools.captureScreen(this.node, function(filePath) {
            cc.log(filePath);
        });
    },

    openFastChatPanelOnClick: function(event, data) {
        if (this.fastChatProgressBar.progress <= 0) {
            if (this.fastChatPanel.position.x === this.fastChatPanelPosition.x) {
                window.Animation.openPanel(this.fastChatPanel);
            }
            else {
                window.Animation.closePanel(this.fastChatPanel);
            }
        }
    },

    voiceOnClick: function() {
        if (this.voiceProgressBar.progress <= 0) {
            this.voiceProgressBar.progress = 1.0;
            cc.log("voiceOnClick");
        }
    },

    openMenuOnClick: function() {
        if (this.menuPanel.position.x === this.menuPanelPosition.x) {
            window.Animation.openPanel(this.menuPanel);
        }
        else {
            window.Animation.closePanel(this.menuPanel);
        }
    },

    closeDialogOnClick: function() {
        // 检查是否关闭聊天面板
        if (this.fastChatPanel.position.x !== this.fastChatPanelPosition.x) {
            window.Animation.closePanel(this.fastChatPanel);
        }

        // 检查是否关闭菜单面板
        if (this.menuPanel.position.x !== this.menuPanelPosition.x) {
            window.Animation.closePanel(this.menuPanel);
        }
    },

    switchFastChatPanelOnClick: function(evt, data) {
        if (data == 1) {
            this.fastChatPanel.getChildByName("fastChatView1").active = true;
            this.fastChatPanel.getChildByName("fastChatView2").active =  false;
        }
        else {
            this.fastChatPanel.getChildByName("fastChatView1").active = false;
            this.fastChatPanel.getChildByName("fastChatView2").active = true;
        }
    },

    wordChatOnClick: function(evt, data) {
        this.fastChatProgressBar.progress = 1.0;
        this.fastChatAudio.setAudioRaw(PX258.audioResourcesUrl.fastChat["fw_male_" + data]).play();

        window.Animation.closePanel(this.fastChatPanel);
    },

    emojiChatOnClick: function(evt, data) {
        this.fastChatProgressBar.progress = 1.0;
        this.fastChatShowTime = +new Date();
        var self = this;

        window.Tools.loadPrefab("emoji/emotion" + data, function(prefab) {
            var node = cc.instantiate(prefab);
            self.emojiNode = node;
            self.node.addChild(node);
            node.getComponent(cc.Animation).play("emotion" + data);
        });

        window.Animation.closePanel(this.fastChatPanel);
    },

    actionOnClick: function(event, data) {
        this._hideActionPanel();
        if (data != 0) {
            this.actionPanel[5].getComponent(cc.Sprite).spriteFrame = event.target.getComponent(cc.Sprite).spriteFrame;
            this._showActionPanel([5]);
        }
    },

    /**
     * 0: 过
     * 1: 吃
     * 2: 碰
     * 3: 杠
     * 4: 胡
     * 5: 中间显示当前选择的动作, 0 除外
     */
    _hideActionPanel: function() {
        for (let i = 0; i < this.actionPanel.length; ++i) {
            this.actionPanel[i].active = false;
        }
    },

    _showActionPanel: function(indexs) {
        if (indexs.length === 1) {
            var self = this;
            self._hideActionPanel();
            this.scheduleOnce(function() {
                self._hideActionPanel();
            }, 1);
        }

        for (let i = 0; i < indexs.length; ++i) {
            this.actionPanel[indexs[i]].active = true;
        }
    }

});
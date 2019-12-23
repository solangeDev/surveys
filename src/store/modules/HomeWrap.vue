<template>
  <v-app>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <div v-if="loading" class="text-xs-center">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="70"
          :width="7"
        ></v-progress-circular>
      </div>
      <v-card v-if="warning">
        <v-card-title class="headline">Switch Accounts?</v-card-title>
        <v-card-text>
          Switching accounts will change your access levels.
          Are you sure you want to switch accounts?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary darken-1"
            flat="flat"
            @click="dialog = false; warning = false; drawerRight = false;"
          >
            No
          </v-btn>

          <v-btn
            color="primary darken-1"
            flat="flat"
            @click="switchAccount(); dialog = false; warning = false; drawerRight = false;"
          >
            Yes
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-navigation-drawer
      v-model="drawerRight"
      fixed
      temporary
      right
      app
      hide-overlay
      disable-resize-watcher
    >
      <v-list>
        <v-list-tile
           v-for="(account, i) in allAccounts"
           :key="i"
           @click="switchAccountQuestion(account)"
         >
         <v-list-tile-title>
             {{ account.business.name }}
         </v-list-tile-title>
       </v-list-tile>
       <v-divider dark class="my-3"></v-divider>
       <v-list-tile @click="logout()">
         <v-list-tile-action>
           <v-icon light>exit_to_app</v-icon>
         </v-list-tile-action>
         <v-list-tile-content>
           <v-list-tile-title>Logout</v-list-tile-title>
         </v-list-tile-content>
       </v-list-tile>
     </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
    v-model="drawer"
    app
    fixed
    mobile-break-point="900"
    disable-resize-watcher>
      <v-list>
       <v-avatar color="primary" size="115" class="my-4">
         <img v-if="userImage" src="" alt="avatar">
         <span v-else class="white--text headline">{{userInitials}}</span>
       </v-avatar>
       <v-list-tile-title class="text-xs-center">{{userNameFirst}}</v-list-tile-title>
       <v-list-tile-sub-title class="text-xs-center mb-4">{{userEmail}}</v-list-tile-sub-title>
       <template>
         <v-list-tile :to="{name: 'HomeApps'}" >
           <v-list-tile-action>
             <v-icon light>grid_on</v-icon>
           </v-list-tile-action>
           <v-list-tile-content>
             <v-list-tile-title>Apps</v-list-tile-title>
           </v-list-tile-content>
         </v-list-tile>
         <v-list-tile :to="{name: 'HomeUsers'}" >
           <v-list-tile-action>
             <v-icon light>people</v-icon>
           </v-list-tile-action>
           <v-list-tile-content>
             <v-list-tile-title>Users</v-list-tile-title>
           </v-list-tile-content>
         </v-list-tile>
         <v-list-tile :to="{name: 'HomeAccount'}" >
           <v-list-tile-action>
             <v-icon light>settings</v-icon>
           </v-list-tile-action>
           <v-list-tile-content>
             <v-list-tile-title>My Account</v-list-tile-title>
           </v-list-tile-content>
         </v-list-tile>
       </template>
     </v-list>
   </v-navigation-drawer>
   <v-toolbar class="" app color="white">
     <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
     <v-spacer></v-spacer>
     <v-toolbar-title class="text-xs-right">{{currentAccount.business.name}}</v-toolbar-title>
     <!-- <v-menu bottom left>
       <v-btn icon slot="activator">
         <v-icon>more_vert</v-icon>
       </v-btn>
       <v-list>
         <v-list-tile
            v-for="(account, i) in allAccounts"
            :key="i"
          >
          <v-list-tile-title
            @click="switchAccountQuestion(account)">
              {{ account.business.name }}
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
         <v-list-tile-title @click="logout()">LOGOUT</v-list-tile-title>
       </v-list-tile>
      </v-list>
    </v-menu> -->
    <v-btn icon @click.stop="drawerRight = !drawerRight">
      <v-icon>more_vert</v-icon>
    </v-btn>
    <!-- <v-toolbar-side-icon @click.stop="drawerRight = !drawerRight"></v-toolbar-side-icon> -->
   </v-toolbar>
   <v-content>
     <router-view @load="startLoad()" @loadEnd="endLoad()"></router-view>
     <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      >
      {{ snackMessage }}
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        Go Login
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarLogin"
      :timeout="timeoutLogin"
    >
     Your session has expired
     <v-btn
       dark
       flat
       @click="snackbarLogin = false"
     >
       Go Login
     </v-btn>
   </v-snackbar>
   </v-content>
   <!-- <v-footer class="pa-3" app>
     <span>© 2018 - <a href="https://github.com/disjfa" class="indigo text--lighten-5">disjfa</a></span>
   </v-footer> -->
 </v-app>
</template>
<script>
import axios from 'axios';
import Env from '../environment';
import LoginFunctions from './controllers/Login';

export default {
  name: 'HomeWrap',
  data: () => ({
    snackbar: true,
    snackbarLogin: false,
    timeout: 6000,
    timeoutLogin: 0,
    // if timeout: 0 snackbar will stay, for login message?
    snackMessage: 'test message',
    showSideNav: false,
    showModal: false,
    dialog: false,
    warning: false,
    loading: false,
    showModalAccount: false,
    showModalLoad: false,
    switchToAccount: {},
    userNameFirst: '',
    userNameLast: '',
    userInitials: '',
    userEmail: '',
    userImage: null,
    drawer: true,
    drawerRight: false,
  }),
  props: {
    source: String,
  },
  computed: {
    ifShowModal() {
      if (this.showModal === true) {
        return true;
      }
      return false;
    },
    allAccounts() {
      return this.$store.getters.getAccounts;
    },
    currentAccount() {
      return this.$store.getters.getActiveAccount;
    },
    permissions() {
      return this.$store.getters.getAccountPermissions;
    },
  },
  created() {
    this.snackbarLogin = false;
    this.startLoad();
    this.getAccounts().then((res) => {
      const data = res.data.payload.accounts;
      this.$store.dispatch('SET_ACCOUNTS', data).then(() => {
        // set default active account to first account:
        if (!this.$store.getters.getActiveAccount.business_id) {
          this.$store.dispatch('SET_ACTIVE_ACCOUNT', this.$store.getters.getAccounts[0]);
        }
      }).then(() => {
        // make api call to select user account and get a new token for that account:
        this.selectUserAccount(this.$store.getters.getActiveAccount.user_id)
          .then(() => {
            this.getUserInfo(this.$store.getters.getActiveAccount.user_id);
          }).then(() => {
            this.$router.push('/Apps');
          }).catch((err) => {
            console.log(err);
          });
      });
      // .then(() => {
      //   this.$router.push('/Apps');
      // });
    });
  },
  methods: {
    /**
    * To show snackbar.
    * @function
    * @param {string} message - The message to be displayed in snackbar
    * @returns {undefined}
    */
    startSnackbar(message) {
      this.snackMessage = message;
      this.snackbar = true;
    },
    /**
    * To show session expired snackbar.
    * @function
    * @returns {undefined}
    */
    sessionExpire() {
      this.snackbarLogin = true;
    },
    /**
    * To close session expired snackbar.
    * @function
    * @returns {undefined}
    */
    sessionExpireClose() {
      this.snackbarLogin = false;
    },
    /**
    * Get's user info.
    * @function
    * @param {integer} userID - user's ID
    * @returns {undefined}
    */
    getUserInfo(userID) {
      const accountToken = this.$store.getters.getAccountToken;
      return axios({
        method: 'GET',
        url: `${Env.url}/api/user/${userID}`,
        headers: {
          Authorization: `Bearer ${accountToken}`,
        },
      }).then((res) => {
        if (res.data.payload.user.image) {
          this.userImage = res.data.payload.user.image;
        }
        this.userNameFirst = res.data.payload.user.first_name;
        this.userNameLast = res.data.payload.user.last_name;
        this.userEmail = res.data.payload.user.email;
      }).then(() => {
        // get initials:
        this.userInitials = this.userNameFirst.substring(0, 1) + this.userNameLast.substring(0, 1);
      }).catch((err) => {
        this.sessionExpire();
        console.log(err);
      });
    },
    /**
    * To get the apps the user has permission to use.
    * @function
    * @returns {undefined}
    */
    getMyAppsPermissions() {
      const accountToken = this.$store.getters.getAccountToken;
      return axios({
        method: 'POST',
        url: `${Env.authorization_url}/api/business/role/details/self`,
        headers: {
          Authorization: `Bearer ${accountToken}`,
        },
      });
    },
    /**
    * To select the business account to use.
    * @function
    * @param {integer} id - the business' id
    * @returns {undefined}
    */
    selectUserAccount(id) {
      const token = this.$store.getters.getToken;
      return axios({
        method: 'POST',
        url: `${Env.business_url}/api/account/login`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          account_id: id,
        },
      }).then((res) => {
        this.$store.dispatch('SET_STORAGE_ACCOUNT_TOKEN', { account_token: res.data.payload.token });
      }).then(() => {
        this.endLoad();
        // this.getMyAppsPermissions().then((res) => {
        //   this.$store.dispatch('SET_ACCOUNT_PERMISSIONS', res.data.payload.role.permissions);
        // }).then(() => {
        //   this.endLoad();
        // });
      }).catch((err) => {
        this.sessionExpire();
        console.log(err);
      });
    },
    /**
    * To get the business accounts that the user has access to.
    * @function
    * @returns {undefined}
    */
    getAccounts() {
      const token = this.$store.getters.getToken;
      console.log(token);
      return axios({
        method: 'POST',
        url: `${Env.business_url}/api/account/list`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    /**
    * To logout.
    * @function
    * @returns {undefined}
    */
    logout() {
      this.startLoad();
      LoginFunctions.logout()
        .then((response) => {
          console.log(response);
          this.$store.dispatch('CLEAR_STORAGE');
          this.endLoad();
          this.$router.push('login');
        }).catch((err) => {
          this.sessionExpire();
          console.log(err);
        });
    },
    /**
    * To start progress/loading spinner dialog.
    * @function
    * @returns {undefined}
    */
    startLoad() {
      this.dialog = true;
      this.loading = true;
      console.log('show loader');
      // then get all the things, then remove modals
    },
    /**
    * To end progress/loading spinner dialog.
    * @function
    * @returns {undefined}
    */
    endLoad() {
      const self = this;
      setTimeout(() => {
        self.dialog = false;
        self.loading = false;
      }, 500);
      /* this.showModalLoad = this.showModal = this.showModalAccount = this.showSideNav = false */
    },
    /**
    * To ask user if they want to switch active business account.
    * @function
    * @param {Object} account - the business account to switch to
    * @returns {undefined}
    */
    switchAccountQuestion(account) {
      this.switchToAccount = account;
      this.dialog = true;
      this.warning = true;
    },
    /**
    * To switch active business account.
    * @function
    * @returns {undefined}
    */
    switchAccount() {
      this.startLoad();
      this.$store.dispatch('SET_ACTIVE_ACCOUNT', this.switchToAccount).then(() => {
        this.selectUserAccount(this.$store.getters.getActiveAccount.user_id);
      });
    },
  },
};
</script>
<style>
</style>

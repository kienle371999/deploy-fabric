<template>
   <div class="mt-8">
      <div class="mt-4">
        <div class="p-6 bg-white rounded-md shadow-md">
          <h2 class="text-lg text-gray-700 font-semibold capitalize">{{ 'Network Configuration'}}</h2>
          <form @submit.prevent="register">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div>
                <label class="text-gray-700" for="org_name">{{ 'Organization Name'}}</label>
                <input class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="text" v-model="user.username"/>
              </div>
              <div>
                <label class="text-gray-700" for="emailAddress">Email Address</label>
                <input class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="email" v-model="user.email"/>
              </div>
              <div>
                <label class="text-gray-700" for="password">Password</label>
                <input class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="password" v-model="user.password"/>
              </div>
              <div>
                <label class="text-gray-700" for="passwordConfirmation">Password Confirmation</label>
                <input class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="password" v-model="user.confirm"/>
              </div>
            </div>
            <div class="flex justify-end mt-4">
              <button class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

interface User {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

export default defineComponent({
  setup() {
    const user = ref<User>({
      username: "",
      email: "",
      password: "",
      confirm: "",
    });

    const register = () => {
      const data = JSON.parse(JSON.stringify(user.value));
      console.log("Registered: ", data);
    };

    return {
      user,
      register,
    };
  },
});
</script>
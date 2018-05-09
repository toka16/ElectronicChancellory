<template>
    <v-container fluid column>
        <v-toolbar color="pink">
            <v-toolbar-title class="white--text">Signature Keys</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="newKeyDialog=true">
                <v-icon>add</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card>
            <v-data-table :headers="headers" :items="items" v-model='selected' select-all item-key="name">
                <template slot='items' slot-scope='props'>
                    <td>
                        <v-checkbox primary hide-details v-model="props.selected"></v-checkbox>
                    </td>
                    <td>{{props.item.name}}</td>
                    <td>{{props.item.date}}</td>
                    <td>
                        <v-btn icon>
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </td>
                </template>
            </v-data-table>
        </v-card>
        <new-key-dialog v-model="newKeyDialog"></new-key-dialog>
    </v-container>
</template>

<script>
import NewKeyDialog from "../components/NewKeyDialog";
export default {
  layout: "vuetify",
  data: () => ({
    newKeyDialog: false,
    selected: [],
    headers: [
      {
        text: "Name",
        value: "name"
      },
      {
        text: "Date",
        value: "date"
      },
      {
        text: "Delete",
        sortable: false
      }
    ],
    items: [
      {
        name: "My first Key",
        date: new Date()
      },
      {
        name: "Other key",
        date: new Date("08/05/2016")
      }
    ]
  }),
  components: { NewKeyDialog }
};
</script>

<style>

</style>

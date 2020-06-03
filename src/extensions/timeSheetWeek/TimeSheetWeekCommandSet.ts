import {override} from '@microsoft/decorators';
import {Log} from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import {Dialog} from '@microsoft/sp-dialog';

import * as strings from 'TimeSheetWeekCommandSetStrings';

import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

let el;

// import Index from './components/Index.vue';
var Index = require("./components/Index.vue");
var acts = (document.getElementsByClassName('item-288') || [])[0];
if (acts) {
  acts.remove();
}

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ITimeSheetWeekCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'TimeSheetWeekCommandSet';

export default class TimeSheetWeekCommandSet extends BaseListViewCommandSet<ITimeSheetWeekCommandSetProperties> {

  @override
  public onInit(): Promise<void> {

    Log.info(LOG_SOURCE, 'Initialized TimeSheetWeekCommandSet');
    var oDiv = document.createElement('div');
    oDiv.id = 'my-vue-div';
    document.body.appendChild(oDiv);
    el = new Vue({
      el: `#${oDiv.id}`,
      data() {
        return {
          dialogTableVisible: false,
          aaa: 1
        };
      },
      render: h => h(Index['default'])
    });
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    // const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    // if (compareOneCommand) {
    //   // This command should be hidden unless exactly one row is selected.
    //   compareOneCommand.visible = event.selectedRows.length === 1;
    // }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'NEW_ITEM':
        // Dialog.alert(`${this.properties.sampleTextTwo}`);
        console.log('hahhahah', el, Index);

        el.dialogTableVisible = true;
        //el.$confirm("fsf");
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}

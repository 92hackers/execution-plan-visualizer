<template>
  <ol v-if="sqlData" class="plan-list">
    <li 
      v-for="(item, index) in sqlData.data" 
      :class="{'highlight-plan': index === selectedPlan }"
      :key="index"
      @click.prevent="handleitem(index)"
    >
      <div :data-tippy-content="formatSql(item.sql)" class="plan-list-item">{{item.sql}}</div>
     </li>
  </ol> 
</template>

<script lang="ts">
import * as _ from 'lodash';
import tippy, {createSingleton, Instance, CreateSingletonInstance} from 'tippy.js';
import sqlData from '@/services/sql-data.js';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { format } from 'sql-formatter';
import { IPlan } from '../iplan';

@Component({})
export default class PlanList extends Vue {
  sqlData: any = [];
  public selectedPlan: number | null = null;
  @Prop() private plan!: IPlan;
  @Prop() private eventBus!: InstanceType<typeof Vue>;

  private tippySingleton!: CreateSingletonInstance;
  private tippyInstances: Instance[] = [];

  mounted() {
    this.sqlData = sqlData;
    this.selectedPlan = 0;
    this.loadTooltips();
  }

  formatSql(sql: string) {
    return format(sql);
  }

  private loadTooltips(): void {
    if (this.tippySingleton) {
      this.tippySingleton.destroy();
    }
    _.each(this.tippyInstances, (instance) => {
      instance.destroy();
    });
    this.tippyInstances = tippy('.plan-list .plan-list-item');
    this.tippySingleton = createSingleton(this.tippyInstances, { delay: 100, allowHTML: true });
  }

  handleitem(index: number) {
    this.selectedPlan = index;
    this.$emit('handleitem', index)
  }
}
</script>

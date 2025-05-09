<template>
  <div class="layout-navbars-breadcrumb-user" :style="{ flex: layoutUserFlexNum }">
    <el-dropdown
      :show-timeout="70"
      :hide-timeout="50"
      @command="onLanguageChange"
    >
      <div class="layout-navbars-breadcrumb-user-icon">
        <i
          class="iconfont"
          style="font-size: 18px"
          :class="disabledI18n === 'en' ? 'icon-fuhao-yingwen' : 'icon-fuhao-zhongwen'"
          :title="$t('message.user.title1')"
        ></i>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="zh-cn" :disabled="disabledI18n === 'zh-cn'"
            >简体中文</el-dropdown-item
          >
          <el-dropdown-item command="en" :disabled="disabledI18n === 'en'"
            >English</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
      <el-icon :title="$t('message.user.title2')">
        <elementSearch />
      </el-icon>
    </div>
    <div class="layout-navbars-breadcrumb-user-icon" @click="onLockClick">
      <el-icon title="锁屏">
        <elementMonitor />
      </el-icon>
    </div>
    <div class="layout-navbars-breadcrumb-user-icon">
      <el-popover
        placement="bottom"
        transition="el-zoom-in-top"
        :width="300"
        :persistent="false"
      >
        <template #reference>
          <el-badge
            :is-dot="true"
          >
            <el-icon :title="$t('message.user.title4')">
              <elementBell />
            </el-icon>
          </el-badge>
        </template>
        <template #default>
          <UserNews />
        </template>
      </el-popover>
    </div>
    <div class="layout-navbars-breadcrumb-user-icon mr10" @click="onScreenfullClick">
      <i
        class="iconfont"
        :title="isScreenfull ? $t('message.user.title6') : $t('message.user.title5')"
        :class="!isScreenfull ? 'icon-fullscreen' : 'icon-tuichuquanping'"
      ></i>
    </div>
    <el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
      <span class="layout-navbars-breadcrumb-user-link">
        <img
          :src="getUserInfos.photo"
          class="layout-navbars-breadcrumb-user-link-photo mr5"
        />
        {{ getUserInfos.username === "" ? "test" : getUserInfos.username }}
        <el-icon class="el-icon--right">
          <elementArrowDown />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="/home">{{
            $t("message.user.dropdown1")
          }}</el-dropdown-item>
          <el-dropdown-item command="wareHouse">{{
            $t("message.user.dropdown6")
          }}</el-dropdown-item>
          <el-dropdown-item command="/personal">{{
            $t("message.user.dropdown2")
          }}</el-dropdown-item>
          <el-dropdown-item command="/404">{{
            $t("message.user.dropdown3")
          }}</el-dropdown-item>
          <el-dropdown-item command="/401">{{
            $t("message.user.dropdown4")
          }}</el-dropdown-item>
          <el-dropdown-item divided command="logOut">{{
            $t("message.user.dropdown5")
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <Search ref="searchRef" />
  </div>
</template>

<script lang="ts">
import { ref, getCurrentInstance, computed, reactive, toRefs, onMounted } from "vue";
import {useRoute, useRouter} from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import screenfull from "screenfull";
import { useI18n } from "vue-i18n";
import { useThemeConfigStateStore } from "@/stores/themeConfig";
import { useUserInfosState } from "@/stores/userInfos";
import other from "@/utils/other";
import { Session, Local } from "@/utils/storage";
import UserNews from "@/layout/navBars/breadcrumb/userNews.vue";
import Search from "@/layout/navBars/breadcrumb/search.vue";
import {storeToRefs} from "pinia";
export default {
  name: "layoutBreadcrumbUser",
  components: { UserNews, Search },
  setup() {
    const { t } = useI18n();
    const { proxy } = getCurrentInstance() as any;
    const router = useRouter();
    const theme = useThemeConfigStateStore();

    const userInfos = useUserInfosState();
    const searchRef = ref();
    const state = reactive({
      isScreenfull: false,
      isShowUserNewsPopover: false,
      disabledI18n: "zh-cn"
    });
    // 获取用户信息 vuex
    const getUserInfos = computed(() => {
      return userInfos.userInfos;
    });
    // 获取布局配置信息
    const getThemeConfig = computed(() => {
      return theme.themeConfig;
    });
    // 设置分割样式
    const layoutUserFlexNum = computed(() => {
      let { layout, isClassicSplitMenu } = getThemeConfig.value;
      let num = 0;
      if (
        layout === "defaults" ||
        (layout === "classic" && !isClassicSplitMenu) ||
        layout === "columns"
      )
        num = 1;
      else num = 0;
      return num;
    });
    // 全屏点击时
    const onScreenfullClick = () => {
      if (!screenfull.isEnabled) {
        ElMessage.warning("暂不不支持全屏");
        return false;
      }
      screenfull.toggle();
      screenfull.on("change", () => {
        if (screenfull.isFullscreen) state.isScreenfull = true;
        else state.isScreenfull = false;
      });
    };
    // 下拉菜单点击时
    const onHandleCommandClick = (path: string) => {
      if (path === "logOut") {
        ElMessageBox({
          closeOnClickModal: false,
          closeOnPressEscape: false,
          title: t("message.user.logOutTitle"),
          message: t("message.user.logOutMessage"),
          showCancelButton: true,
          confirmButtonText: t("message.user.logOutConfirm"),
          cancelButtonText: t("message.user.logOutCancel"),
          buttonSize: 'default',
          beforeClose: (action:string, instance:any, done:any) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = t("message.user.logOutExit");
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 700);
            } else {
              done();
            }
          },
        })
          .then(async () => {
            Session.clear(); // 清除缓存/token等
            window.location.reload();
          })
          .catch(() => {});
      } else if (path === "wareHouse") {
        window.open("");
      } else {
        router.push(path);
      }
    };
    // 菜单搜索点击
    const onSearchClick = () => {
      searchRef.value.openSearch();
    };
    // 语言切换
    const onLanguageChange = (lang: string) => {
      Local.remove("themeConfig");
      getThemeConfig.value.globalI18n = lang;
      Local.set("themeConfig", getThemeConfig.value);
      proxy.$i18n.locale = lang;
      initI18n();
      other.useTitle();
    };
    // 设置 element plus 组件的国际化
    const setI18nConfig = (locale: string) => {
      if (proxy.$i18n && proxy.$i18n.messages){
        proxy.mittBus.emit("getI18nConfig", proxy.$i18n.messages[locale]);
      }
    };
    // 菜单锁屏点击
    const onLockClick = () => {
      //Local.remove("themeConfig");
      getThemeConfig.value.isLockScreen = true;
      getThemeConfig.value.lockScreenTime = 0;
      Local.set("themeConfig", getThemeConfig.value);
    };
    // 初始化言语国际化
    const initI18n = () => {
      switch (Local.get("themeConfig").globalI18n) {
        case "zh-cn":
          state.disabledI18n = "zh-cn";
          setI18nConfig("zh-cn");
          break;
        case "en":
          state.disabledI18n = "en";
          setI18nConfig("en");
          break;
      }
    };
    const portalChange = async (porid:any)=>{
      console.log(porid)
    }
    // 页面加载时
    onMounted(() => {
      if (Local.get("themeConfig")) {
        initI18n();
        //initComponentSize();
      }
    });
    return {
      getUserInfos,
      onHandleCommandClick,
      onScreenfullClick,
      onSearchClick,
      onLockClick,
      onLanguageChange,
      portalChange,
      searchRef,
      layoutUserFlexNum,
      ...toRefs(state),
    };
  },
};
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .layout-navbars-breadcrumb-user-icon {
    font-size: 18px;
  }
  &-link {
    height: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;
    &-photo {
      width: 25px;
      height: 25px;
      border-radius: 100%;
    }
  }
  &-icon {
    padding: 0 10px;
    cursor: pointer;
    color: var(--bg-topBarColor);
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
    &:hover {
      background: rgba(0, 0, 0, 0.04);
      i {
        display: inline-block;
        animation: logoAnimation 0.3s ease-in-out;
      }
    }
  }
  ::v-deep(.el-dropdown) {
    color: var(--bg-topBarColor);
  }
  ::v-deep(.el-badge) {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
  }
  ::v-deep(.el-badge__content.is-fixed) {
    top: 12px;
  }
}
</style>

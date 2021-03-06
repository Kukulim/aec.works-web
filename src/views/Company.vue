<template>
  <div class="wrapper sm-grid-sidebar-down">
    <div v-if="company" class="content">
      <div class="company-images">
        <lazy-img class="logo" :src="company.logoUrl || defaultLogo" alt="Company Logo" />
        <lazy-img class="cover" :src="company.coverUrl || defaultCover" alt="Company Cover Image" />
      </div>

      <h1 class="mt-2">
        {{ company.name }}
        <span class="small muted ml">{{ company.location || 'Somewhere' }}</span>
      </h1>

      <div class="mt-2 mb-2">
        <p class="sans">{{ company.description || '...' }}</p>
      </div>

      <div class="flex mt-2 mb-2">
        <div>
          <label>Website</label>
          <a :href="company.website">{{ company.website || '-' | cleanUrl }}</a>
        </div>
      </div>

      <div class="mt-2">
        <label>Tags</label>
        <Hashtag v-for="slug in company.hashtags" :key="slug" :slug="slug" />
      </div>

      <div v-if="company.articles.length" class="mt-2">
        <label class="mb">Articles</label>
        <ArticleCard v-for="article in company.articles" :key="article.url" :article="article" />
      </div>

      <div class="mt-2">
        <TwitterFeed v-if="company.twitterHandle" :handle="company.twitterHandle" />
      </div>
    </div>

    <div v-if="company" class="sidebar">
      <div>
        <Icon icon="clap" clickable @click="handleClap(company)">
          {{ localClapCount || company.clapCount }}
        </Icon>
      </div>
      <div>
        <Icon icon="chat">{{ company.threadSize || 0 }}</Icon>
      </div>

      <div class="mt-2">
        <label>Share</label>
        <SocialShare />
      </div>

      <div v-if="userIsEditor" class="mt-2">
        <!-- <label>Contribute</label> -->
        <Button @click="handleEdit">Edit</Button>
      </div>
    </div>

    <div class="footer">
      <Discussion v-if="company && company.threadId" :thread-id="company.threadId" />
    </div>
  </div>
</template>

<script>
import Button from '../components/forms/Button.vue'
import { USERS } from '@/store/users'
import SocialShare from '@/components/SocialShare'
import Icon from '@/components/Icon.vue'
import ArticleCard from '../components/ArticleCard.vue'
import TwitterFeed from '../components/TwitterFeed.vue'
import api from '@/api'
import Discussion from '@/components/Discussion'
import Hashtag from '@/components/Hashtag'
import LazyImg from '@/components/LazyImg'
import { waitForLogin } from '@/mixins'

export default {
  name: 'Company',
  metaInfo() {
    const company = this.company
    return {
      title: () => (company && company.name ? company.name : 'Companies'),
    }
  },
  components: {
    Discussion,
    LazyImg,
    Hashtag,
    Icon,
    SocialShare,
    TwitterFeed,
    ArticleCard,
    Button,
  },
  filters: {
    cleanUrl(value) {
      return value.replace('https://', '').replace('http://', '')
    },
  },
  props: {
    slug: { required: false, type: String },
  },
  data() {
    return {
      errors: [],
      company: null,
      localClapCount: null,
      defaultLogo: require('@/assets/images/image.svg'),
      defaultCover: 'https://picsum.photos/600/200.jpg?blur=5&grayscale',
    }
  },
  computed: {
    userIsEditor() {
      return this.$store.getters[USERS.IS_EDITOR]
    },
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const company = await api.getCompany(this.slug)
      this.company = company
    },
    handleEdit() {
      this.$router.push({ name: 'CompanyEdit', params: { slug: this.slug } })
    },
    async handleClap(company) {
      await waitForLogin()
      const clapCount = await api.postCompanyClap(company.slug)
      this.localClapCount = clapCount
    },
  },
}
</script>

<style lang="scss">
.sidebar {
  @include for-large-up {
    // margin-top: 130px;
  }
}
.company-images {
  position: relative;
  .logo {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 25px;
    right: 25px;
    @extend .border-thin;
  }
  .cover {
    display: block; // Remove gap below image
    height: 100px;
    width: 100%;
    object-fit: cover;
    object-position: center;

    @extend .border-thin;
  }
}
</style>

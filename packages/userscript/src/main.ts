import { minecraftNet } from './sites/minecraft-net'
import { feedback } from './sites/feedback'
import { help } from './sites/help'
import './config'

switch (location.host) {
  case 'www.minecraft.net':
    minecraftNet()
    break
  /*   case 'twitter.com':
  case 'moble.twitter.com':
    twitter()
  break
  */
  case 'feedback.minecraft.net':
    feedback()
    break
  case 'help.minecraft.net':
    help()
}

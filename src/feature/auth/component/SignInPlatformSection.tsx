import {signInWithOAuth} from '@/feature/auth/serverAction/ServerAction'
import {Icon} from '@iconify/react'
import {Button} from '@nextui-org/react'

export type SignInPlatformSectionProps = {
  returnTo?: string
}

export const SignInPlatformSection = ({
  returnTo,
}: SignInPlatformSectionProps) => (
  <div className="flex flex-col gap-2">
    <Button
      onPress={() => signInWithOAuth('google', returnTo)}
      startContent={<Icon icon="flat-color-icons:google" width={24} />}
      variant="bordered"
    >
      Continue with Google
    </Button>
    <Button
      onPress={() => signInWithOAuth('github', returnTo)}
      startContent={
        <Icon className="text-default-500" icon="fe:github" width={24} />
      }
      variant="bordered"
    >
      Continue with Github
    </Button>
  </div>
)

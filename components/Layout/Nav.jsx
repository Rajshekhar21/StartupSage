import { Avatar } from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Container from './Container';
import styles from './Nav.module.css';
import Spacer from './Spacer';
// import Wrapper from './Wrapper';
import logo from '../../assets/logo.png';
import Image from 'next/image';

const UserMenu = ({ user, mutate }) => {
  const menuRef = useRef();
  const avatarRef = useRef();

  const [visible, setVisible] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const onRouteChangeComplete = () => setVisible(false);
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    return () =>
      router.events.off('routeChangeComplete', onRouteChangeComplete);
  });

  useEffect(() => {
    // detect outside click to close menu
    const onMouseDown = (event) => {
      if (
        !menuRef.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  const onSignOut = useCallback(async () => {
    try {
      await fetcher('/api/auth', {
        method: 'DELETE',
      });
      toast.success('You have been signed out');
      mutate({ user: null });
    } catch (e) {
      toast.error(e.message);
    }
  }, [mutate]);

  return (
    <div className={styles.user}>
      <button
        className={styles.trigger}
        ref={avatarRef}
        onClick={() => setVisible(!visible)}
      >
        <Avatar size={52} username={user.username} url={user.profilePicture} />
      </button>
      <div
        ref={menuRef}
        role="menu"
        aria-hidden={visible}
        className={styles.popover}
      >
        {visible && (
          <div className={styles.menu}>
            <Link
              passHref
              href={`/user/${user.username}`}
              className={styles.item}
            >
              Profile
            </Link>
            <Link passHref href="/settings" className={styles.item}>
              Settngs
            </Link>
            <Link passHref href="/startups" className={styles.item}>
              Startup Gallery
            </Link>
            <Link passHref href="/serviceproviders" className={styles.item}>
              Service Provider Gallery
            </Link>
            <button onClick={onSignOut} className={styles.item}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Nav = () => {
  const { data: { user } = {}, mutate } = useCurrentUser();

  return (
    <nav className={styles.nav}>
      {/* <Wrapper className={styles.wrapper}> */}
      <Container
        className={styles.content}
        alignItems="center"
        justifyContent="space-between"
      >
        <div>
          <Image
            src={logo}
            alt="Description of the image"
            width={100}
            height={100}
          />
          <Link href="/" className={styles.logo}>
            Pistachio
          </Link>
        </div>
        <Container>
          {user ? (
            <>
              <UserMenu user={user} mutate={mutate} />
            </>
          ) : (
            <>
              <Link passHref href="/login" legacyBehavior>
                <ButtonLink
                  size="small"
                  type="success"
                  variant="ghost"
                  color="link"
                >
                  Log in
                </ButtonLink>
              </Link>
              <Spacer axis="horizontal" size={0.25} />
              <Link passHref href="/sign-up" legacyBehavior>
                <Button size="small" type="success">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </Container>
      </Container>
      {/* </Wrapper> */}
    </nav>
  );
};

export default Nav;

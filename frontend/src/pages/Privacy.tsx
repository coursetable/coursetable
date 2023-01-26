import React from 'react';

import styled from 'styled-components';
import styles from './Privacy.module.css';
import { TextComponent } from '../components/StyledComponents';

// Header
const StyledH1 = styled.h1`
  font-weight: 600;
  font-size: 25px;
  text-align: center;
  transition: color ${({ theme }) => theme.trans_dur};
`;

const Underline = styled.span`
  text-decoration: underline;
`;

/**
 * Renders the privacy page
 */
const Privacy: React.VFC = () => {
  return (
    <div className={`${styles.container} mx-auto`}>
      <StyledH1 className={'mt-5 mb-1'}>Privacy Policy</StyledH1>
      <TextComponent type={1}>
        <p>
          <strong>PRIVACY NOTICE</strong>
        </p>
        <p>
          <strong>Last updated January 24, 2023</strong>
        </p>
        <p>
          This privacy notice for CourseTable ("<strong>Company</strong>," "
          <strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>
          "), describes how and why we might collect, store, use, and/or share
          ("<strong>process</strong>") your information when you use our
          services ("<strong>Services</strong>"), such as when you:
        </p>
        <ul>
          <li>
            Visit our website at{' '}
            <a href="http://www.coursetable.com/">http://www.coursetable.com</a>
            , or any website of ours that links to this privacy notice
          </li>
          <li>Engage with us in other related ways</li>
        </ul>
        <p>
          <strong>Questions or concerns? </strong>Reading this privacy notice
          will help you understand your privacy rights and choices. If you do
          not agree with our policies and practices, please do not use our
          Services. If you still have any questions or concerns, please contact
          us at{' '}
          <a href="mailto: coursetable.at.yale@gmail.com">
            coursetable.at.yale@gmail.com
          </a>
          .
        </p>
        <p>
          <strong>SUMMARY OF KEY POINTS</strong>
        </p>
        <p>
          <strong>
            <em>
              This summary provides key points from our privacy notice, but you
              can find out more details about any of these topics by clicking
              the link following each key point or by using our table of
              contents below to find the section you are looking for. You can
              also click <a href="#toc">here</a> to go directly to our table of
              contents.
            </em>
          </strong>
        </p>
        <p>
          <strong>What personal information do we process?</strong> When you
          visit, use, or navigate our Services, we may process personal
          information depending on how you interact with CourseTable and the
          Services, the choices you make, and the products and features you use.
          Click <a href="#personalinfo">here</a> to learn more.
        </p>
        <p>
          <strong>Do we process any sensitive personal information?</strong> We
          do not process sensitive personal information.
        </p>
        <p>
          <strong>Do we receive any information from third parties?</strong> We
          may receive information from public databases, social media platforms,
          and other outside sources. Click <a href="#othersources">here</a> to
          learn more.
        </p>
        <p>
          <strong>How do we process your information?</strong> We process your
          information to provide, improve, and administer our Services,
          communicate with you, for security and fraud prevention, and to comply
          with law. We may also process your information for other purposes with
          your consent. We process your information only when we have a valid
          legal reason to do so. Click <a href="#infouse">here</a> to learn
          more.
        </p>
        <p>
          <strong>
            In what situations and with which parties do we share personal
            information?
          </strong>{' '}
          We do not share information in any situations and with any third
          parties. Click <a href="#whoshare">here</a> to learn more.
        </p>
        <p>
          <strong>How do we keep your information safe?</strong> We have
          organizational and technical processes and procedures in place to
          protect your personal information. However, no electronic transmission
          over the internet or information storage technology can be guaranteed
          to be 100% secure, so we cannot promise or guarantee that hackers,
          cybercriminals, or other unauthorized third parties will not be able
          to defeat our security and improperly collect, access, steal, or
          modify your information. Click <a href="#infosafe">here</a> to learn
          more.
        </p>
        <p>
          <strong>What are your rights?</strong> Depending on where you are
          located geographically, the applicable privacy law may mean you have
          certain rights regarding your personal information. Click{' '}
          <a href="#privacyrights">here</a> to learn more.
        </p>
        <p>
          <strong>How do you exercise your rights?</strong> The easiest way to
          exercise your rights is by submitting a data subject request. You can
          submit a data subject request by contacting us at{' '}
          <a href="mailto: coursetable.at.yale@gmail.com">
            coursetable.at.yale@gmail.com
          </a>
          . We will consider and act upon any request in accordance with
          applicable data protection laws.
        </p>
        <p>
          Want to learn more about what CourseTable does with any information we
          collect? Click <a href="#toc">here</a> to review the notice in full.
        </p>
        <p id="toc">
          <strong>TABLE OF CONTENTS</strong>
        </p>
        <p>
          <a href="#infocollect">1. WHAT INFORMATION DO WE COLLECT?</a>
        </p>
        <p>
          <a href="#infouse">2. HOW DO WE PROCESS YOUR INFORMATION?</a>
        </p>
        <p>
          <a href="#whoshare">
            3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
          </a>
        </p>
        <p>
          <a href="#sociallogins">4. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a>
        </p>
        <p>
          <a href="#inforetain">5. HOW LONG DO WE KEEP YOUR INFORMATION?</a>
        </p>
        <p>
          <a href="#infosafe">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</a>
        </p>
        <p>
          <a href="#infominors">7. DO WE COLLECT INFORMATION FROM MINORS?</a>
        </p>
        <p>
          <a href="#privacyrights">8. WHAT ARE YOUR PRIVACY RIGHTS?</a>
        </p>
        <p>
          <a href="#DNT">9. CONTROLS FOR DO-NOT-TRACK FEATURES</a>
        </p>
        <p>
          <a href="#caresidents">
            10. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
          </a>
        </p>
        <p>
          <a href="#policyupdates">11. DO WE MAKE UPDATES TO THIS NOTICE?</a>
        </p>
        <p>
          <a href="#contact">12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a>
        </p>
        <p>
          <a href="#request">
            13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
            YOU?
          </a>
        </p>
        <p id="infocollect">
          <strong>1. WHAT INFORMATION DO WE COLLECT?</strong>
        </p>
        <p id="personalinfo">
          <strong>Personal information you disclose to us</strong>
        </p>
        <p>
          <strong>
            <em>
              In Short: We collect personal information that you provide to us.
            </em>
          </strong>
        </p>
        <p>
          We collect personal information that you voluntarily provide to us
          when you register on the Services, express an interest in obtaining
          information about us or our products and Services, when you
          participate in activities on the Services, or otherwise when you
          contact us.
        </p>
        <p>
          <strong>Sensitive Information.</strong> We do not process sensitive
          information.
        </p>
        <p>
          <strong>Social Media Login Data. </strong>We may provide you with the
          option to link your CourseTable account to your existing Facebook
          account. If you choose to do this, we will collect the information
          described in the section called "
          <a href="#sociallogins">HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a>"
          below.
        </p>
        <p>
          All personal information that you provide to us must be true,
          complete, and accurate, and you must notify us of any changes to such
          personal information.
        </p>
        <p>
          <strong>Information automatically collected</strong>
        </p>
        <p>
          <strong>
            <em>
              In Short: Some information — such as your Internet Protocol (IP)
              address and/or browser and device characteristics — is collected
              automatically when you visit our Services.
            </em>
          </strong>
        </p>
        <p>
          We automatically collect certain information when you visit, use, or
          navigate the Services. This information does not reveal your specific
          identity (like your name or contact information) but may include
          device and usage information, such as your IP address, browser and
          device characteristics, operating system, language preferences,
          referring URLs, device name, country, location, information about how
          and when you use our Services, and other technical information. This
          information is primarily needed to maintain the security and operation
          of our Services, and for our internal analytics and reporting
          purposes.
        </p>
        <p>The information we collect includes:</p>
        <ul>
          <li>
            <em>Log and Usage Data.</em> Log and usage data is service-related,
            diagnostic, usage, and performance information our servers
            automatically collect when you access or use our Services and which
            we record in log files. Depending on how you interact with us, this
            log data may include your IP address, device information, browser
            type, and settings and information about your activity in the
            Services (such as the date/time stamps associated with your usage,
            pages and files viewed, searches, and other actions you take such as
            which features you use), device event information (such as system
            activity, error reports (sometimes called "crash dumps"), and
            hardware settings).
          </li>

          <li>
            <em>Device Data.</em> We collect device data such as information
            about your computer, phone, tablet, or other device you use to
            access the Services. Depending on the device used, this device data
            may include information such as your IP address (or proxy server),
            device and application identification numbers, location, browser
            type, hardware model, Internet service provider and/or mobile
            carrier, operating system, and system configuration information.
          </li>

          <li>
            <em>Location Data.</em> We collect location data such as information
            about your device's location, which can be either precise or
            imprecise. How much information we collect depends on the type and
            settings of the device you use to access the Services. For example,
            we may use GPS and other technologies to collect geolocation data
            that tells us your current location (based on your IP address). You
            can opt out of allowing us to collect this information either by
            refusing access to the information or by disabling your Location
            setting on your device. However, if you choose to opt out, you may
            not be able to use certain aspects of the Services.
          </li>
        </ul>
        <p id="othersources">
          <strong>Information collected from other sources</strong>
        </p>
        <p>
          <strong>
            <em>
              In Short: We may collect limited data from public databases and
              other outside sources.
            </em>
          </strong>
        </p>
        <p>
          In order to enhance our ability to provide functional services to you
          and update our records, we may obtain information about you from other
          sources, such as public databases, data providers, and from other
          third parties. We source our data from a combination of Yale's{' '}
          <a
            href="https://courses.yale.edu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            course catalog
          </a>
          ,{' '}
          <a
            href="https://oce.app.yale.edu/oce-viewer/studentViewer/index"
            target="_blank"
            rel="noopener noreferrer"
          >
            historical evaluations database
          </a>
          , and{' '}
          <a
            href="https://ivy.yale.edu/course-stats/"
            target="_blank"
            rel="noopener noreferrer"
          >
            course demand portal
          </a>
          . Some of the information is also pulled from our historical archives
          of the aforementioned data sources. This information includes names,
          email addresses, student identification numbers, and other student
          data.
        </p>
        <p id="infouse">
          <strong>2. HOW DO WE PROCESS YOUR INFORMATION?</strong>
        </p>
        <p>
          <strong>
            <em>
              In Short: We process your information to provide, improve, and
              administer our Services, communicate with you, for security and
              fraud prevention, and to comply with law. We may also process your
              information for other purposes with your consent.
            </em>
          </strong>
        </p>
        <p>
          <strong>
            We process your personal information for a variety of reasons,
            depending on how you interact with our Services, including:
          </strong>
        </p>
        <ul>
          <li>
            <strong>
              To facilitate account creation and authentication and otherwise
              manage user accounts.{' '}
            </strong>
            We may process your information so you can create and log in to your
            account, as well as keep your account in working order.
          </li>

          <li>
            <strong>
              To deliver and facilitate delivery of services to the user.{' '}
            </strong>
            We may process your information to provide you with the requested
            service.
          </li>

          <li>
            <strong>
              To evaluate and improve our Services, products, and your
              experience.
            </strong>
            We may process your information when we believe it is necessary to
            identify usage trends, and to evaluate and improve our Services,
            products, and your experience.
          </li>

          <li>
            <strong>To identify usage trends.</strong> We may process
            information about how you use our Services to better understand how
            they are being used so we can improve them.
          </li>

          <li>
            <strong>
              To integrate our services into one place for the user.
            </strong>
            __________
          </li>
        </ul>
        <p id="whoshare">
          <strong>
            3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
          </strong>
        </p>
        <p>
          We do not share your personal information in any situation with any
          third parties.
        </p>
        <p id="sociallogins">
          <strong>4. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</strong>
        </p>
        <p>
          <strong>
            <em>
              In Short: If you choose to link to our Services using a social
              media account, we may have access to certain information about
              you.
            </em>
          </strong>
        </p>
        <p>
          Our Services offer you the ability to link your CourseTable account
          with your Facebook account. Where you choose to do this, we will
          receive certain profile information about you from your social media
          provider. The profile information we receive may vary depending on the
          social media provider concerned, but will often include your name,
          email address, and friends list, as well as other information you
          choose to make public on such a social media platform.
        </p>
        <p>
          We will use the information we receive only for the purposes that are
          described in this privacy notice or that are otherwise made clear to
          you on the relevant Services. Please note that we do not control, and
          are not responsible for, other uses of your personal information by
          your third-party social media provider. We recommend that you review
          their privacy notice to understand how they collect, use, and share
          your personal information, and how you can set your privacy
          preferences on their sites and apps.
        </p>
        <p id="inforetain">
          <strong>5. HOW LONG DO WE KEEP YOUR INFORMATION?</strong>
        </p>
        <p>
          <strong>
            <em>
              In Short: We keep your information for as long as necessary to
              fulfill the purposes outlined in this privacy notice unless
              otherwise required by law.
            </em>
          </strong>
        </p>
        <p>
          We will only keep your personal information for as long as it is
          necessary for the purposes set out in this privacy notice, unless a
          longer retention period is required or permitted by law (such as tax,
          accounting, or other legal requirements). No purpose in this notice
          will require us keeping your personal information for longer than
          three (3) months past the termination of the user's account.
        </p>
        <p>
          When we have no ongoing legitimate business need to process your
          personal information, we will either delete or anonymize such
          information, or, if this is not possible (for example, because your
          personal information has been stored in backup archives), then we will
          securely store your personal information and isolate it from any
          further processing until deletion is possible.
        </p>
        <p id="infosafe">
          <strong>6. HOW DO WE KEEP YOUR INFORMATION SAFE?</strong>
        </p>
        <p>
          <strong>
            <em>
              In Short: We aim to protect your personal information through a
              system of organizational and technical security measures.
            </em>
          </strong>
        </p>
        <p>
          We have implemented appropriate and reasonable technical and
          organizational security measures designed to protect the security of
          any personal information we process. However, despite our safeguards
          and efforts to secure your information, no electronic transmission
          over the Internet or information storage technology can be guaranteed
          to be 100% secure, so we cannot promise or guarantee that hackers,
          cybercriminals, or other unauthorized third parties will not be able
          to defeat our security and improperly collect, access, steal, or
          modify your information. Although we will do our best to protect your
          personal information, transmission of personal information to and from
          our Services is at your own risk. You should only access the Services
          within a secure environment.
        </p>
        <p id="infominors">
          <strong>7. DO WE COLLECT INFORMATION FROM MINORS?</strong>
        </p>
        <p>
          <strong>
            <em>
              In Short: We do not knowingly collect data from or market to
              children under 18 years of age.
            </em>
          </strong>
        </p>
        <p>
          We do not knowingly solicit data from or market to children under 18
          years of age. By using the Services, you represent that you are at
          least 18 or that you are the parent or guardian of such a minor and
          consent to such minor dependent's use of the Services. If we learn
          that personal information from users less than 18 years of age has
          been collected, we will deactivate the account and take reasonable
          measures to promptly delete such data from our records. If you become
          aware of any data we may have collected from children under age 18,
          please contact us at{' '}
          <a href="mailto: coursetable.at.yale@gmail.com">
            coursetable.at.yale@gmail.com
          </a>
          .
        </p>
        <p id="privacyrights">
          <strong>8. WHAT ARE YOUR PRIVACY RIGHTS?</strong>
        </p>
        <p>
          <strong>
            <em>
              In Short: You may review, change, or terminate your account at any
              time.
            </em>
          </strong>
        </p>
        <p></p>
        <p>
          If you are located in the EEA or UK and you believe we are unlawfully
          processing your personal information, you also have the right to
          complain to your local data protection supervisory authority. You can
          find their contact details here:{' '}
          <a href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm">
            https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm
          </a>
          .
        </p>
        <p>
          If you are located in Switzerland, the contact details for the data
          protection authorities are available here:{' '}
          <a href="https://www.edoeb.admin.ch/edoeb/en/home.html">
            https://www.edoeb.admin.ch/edoeb/en/home.html
          </a>
          .
        </p>
        <p>
          <strong>
            <Underline>Withdrawing your consent:</Underline>{' '}
          </strong>
          If we are relying on your consent to process your personal
          information, which may be express and/or implied consent depending on
          the applicable law, you have the right to withdraw your consent at any
          time. You can withdraw your consent at any time by contacting us by
          using the contact details provided in the section "
          <a href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a>"
          below.
        </p>
        <p>
          However, please note that this will not affect the lawfulness of the
          processing before its withdrawal nor, when applicable law allows, will
          it affect the processing of your personal information conducted in
          reliance on lawful processing grounds other than consent.
        </p>
        <p>
          <strong>Account Information</strong>
        </p>
        <p>
          If you would at any time like to review or change the information in
          your account or terminate your account, you can:
        </p>
        <ul>
          <li>Contact us using the contact information provided.</li>
        </ul>
        <p>
          Upon your request to terminate your account, we will deactivate or
          delete your account and information from our active databases.
          However, we may retain some information in our files to prevent fraud,
          troubleshoot problems, assist with any investigations, enforce our
          legal terms and/or comply with applicable legal requirements.
        </p>
        <p>
          If you have questions or comments about your privacy rights, you may
          email us at{' '}
          <a href="mailto: coursetable.at.yale@gmail.com">
            coursetable.at.yale@gmail.com
          </a>
          .
        </p>
        <p id="DNT">
          <strong>9. CONTROLS FOR DO-NOT-TRACK FEATURES</strong>
        </p>
        <p>
          Most web browsers and some mobile operating systems and mobile
          applications include a Do-Not-Track ("DNT") feature or setting you can
          activate to signal your privacy preference not to have data about your
          online browsing activities monitored and collected. At this stage no
          uniform technology standard for recognizing and implementing DNT
          signals has been finalized. As such, we do not currently respond to
          DNT browser signals or any other mechanism that automatically
          communicates your choice not to be tracked online. If a standard for
          online tracking is adopted that we must follow in the future, we will
          inform you about that practice in a revised version of this privacy
          notice.
        </p>
        <p id="caresidents">
          <strong>
            10. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
          </strong>
        </p>
        <p>
          <strong>
            <em>
              In Short: Yes, if you are a resident of California, you are
              granted specific rights regarding access to your personal
              information.
            </em>
          </strong>
        </p>
        <p>
          California Civil Code Section 1798.83, also known as the "Shine The
          Light" law, permits our users who are California residents to request
          and obtain from us, once a year and free of charge, information about
          categories of personal information (if any) we disclosed to third
          parties for direct marketing purposes and the names and addresses of
          all third parties with which we shared personal information in the
          immediately preceding calendar year. If you are a California resident
          and would like to make such a request, please submit your request in
          writing to us using the contact information provided below.
        </p>
        <p>
          If you are under 18 years of age, reside in California, and have a
          registered account with Services, you have the right to request
          removal of unwanted data that you publicly post on the Services. To
          request removal of such data, please contact us using the contact
          information provided below and include the email address associated
          with your account and a statement that you reside in California. We
          will make sure the data is not publicly displayed on the Services, but
          please be aware that the data may not be completely or comprehensively
          removed from all our systems (e.g., backups, etc.).
        </p>
        <p id="policyupdates">
          <strong>11. DO WE MAKE UPDATES TO THIS NOTICE?</strong>
        </p>
        <p>
          <strong>
            <em>
              In Short: Yes, we will update this notice as necessary to stay
              compliant with relevant laws.
            </em>
          </strong>
        </p>
        <p>
          We may update this privacy notice from time to time. The updated
          version will be indicated by an updated "Revised" date and the updated
          version will be effective as soon as it is accessible. If we make
          material changes to this privacy notice, we may notify you either by
          prominently posting a notice of such changes or by directly sending
          you a notification. We encourage you to review this privacy notice
          frequently to be informed of how we are protecting your information.
        </p>
        <p id="contact">
          <strong>12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</strong>
        </p>
        <p>
          If you have questions or comments about this notice, you may email us
          at{' '}
          <a href="mailto: coursetable.at.yale@gmail.com">
            coursetable.at.yale@gmail.com
          </a>
          .
        </p>
        <p id="request">
          <strong>
            13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
            YOU?
          </strong>
        </p>
        <p>
          You have the right to request access to the personal information we
          collect from you, change that information, or delete it. To request to
          review, update, or delete your personal information, please contact us
          at{' '}
          <a href="mailto: coursetable.at.yale@gmail.com">
            coursetable.at.yale@gmail.com
          </a>
          .
        </p>
      </TextComponent>
    </div>
  );
};

export default Privacy;

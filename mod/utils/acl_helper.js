/**
 * @author Pedro Sanders
 * @since v1
 */
load('mod/core/acl_rule.js')

/**
 * Helps verify if a device is allow or not to REGISTER and place calls.
 *
 * Rules may be in CIDR, IP/Mask, or single IP format. Example
 * of rules are:
 *
 * acl:
 *  deny:
        0.0.0.0/1   # deny all
 *  allow
      - 192.168.1.0/255.255.255.0
 *    - 192.168.0.1/31
 */
function ACLHelper() {
    const LogManager = Packages.org.apache.logging.log4j.LogManager
    const LOG = LogManager.getLogger()

    this.mostSpecific = (rules, ip) => {
        try {
            const r = rules
                .stream()
                .filter(rule => rule.hasIp(ip))
                .sorted((r1, r2) => java.lang.Integer.compare(r2.getAddressCount(), r1.getAddressCount()))
                .findFirst()
            return r.get()
        } catch (e) {
            if (e instanceof java.util.NoSuchElementException) {
                LOG.warn('Not default rules found for domain acl. This is a security concern')
            } else {
                LOG.warn(e)
            }
        }
        return new Rule('allow', '0.0.0.0/1')
    }
}
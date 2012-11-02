#encoding: utf-8

file = File.open("index2.html", "rb")



arr = file.read.to_s.force_encoding('UTF-8').split(/第(\S{1,3})回/)



pageArr = []


i = 1
title = ''
a = ''
for t in arr  
  if i % 2 == 0    
    pageArr = []
    pageArr << '<h2>第' + t + '回 '
    title = '第' + t + '回 '
    a = t
  else
    tArr = t.split(' ')
    j = 0
    for m in tArr
      if j == 0
        title += m
        pageArr << m + '</h2>'
      else
        pageArr << '<p>' + m + '</p>'
      end
      j += 1
    end
    
    contentArr = []
    contentArr << '<!DOCTYPE html public "-//W3C//DTD HTML 4.0 Transitional//EN">'
    contentArr << '<html>'
    contentArr << '<head>'
    contentArr << '  <meta http-equiv="content-type" content="text/html; charset=utf-8">'
    contentArr << '  <title>' + title + ' - 八仙得道（清）无垢道人著</title>'
    contentArr << '  <style>p{line-height:22px;}</style>' 
    contentArr << '</head>'
    contentArr << '<body>'
    contentArr << pageArr.join('')
    contentArr << '</body>'
    contentArr << '</html>'
    
    new_file = File.open("files/" + a.to_s + ".html", "w+")
    new_file.write contentArr.join('')
    new_file.close
  end
  i += 1
end
# 
    # s += '<!DOCTYPE html public "-//W3C//DTD HTML 4.0 Transitional//EN">'
    # s += '<html>'
    # s += '<head>'
    # s += '  <meta http-equiv="content-type" content="text/html; charset=utf-8">'
    # s += '  <title>八仙得道（清）无垢道人著</title>'
    # s += '</head>'
    # s += '<body>' + t + '.html">第' + t
# 

# 
# puts s

# new_file = File.open("index2.html", "w+")
# 
# new_file.write buffer
# 
# new_file.close

# file.each_line do | line | 
	# if line.chomp != ""
		# line.gsub!('<SPAN LANG="zh-CN">', '')
		# puts line
	# end
# end
# 
# new_file = File.open("_index.html", "w+")
# new_file.write s
# new_file.close

file.close
